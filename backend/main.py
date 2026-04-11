import json
import logging
import os
import random
import re
import requests
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from typing import List
import dotenv

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.exc import SQLAlchemyError
from jose import jwt, JWTError
from sqlalchemy.orm import Session

try:
    from . import models, schemas
    from .database import engine, get_db
    from .middleware import register_all_middleware
    from .middleware.rate_limiter import limiter
    from .services import docs_service, link_service, llm_service, pdf_service, storage_service, user_service, email_service
    from .services.user_service import ALGORITHM, SECRET_KEY
except ImportError:
    import models, schemas
    from database import engine, get_db
    from middleware import register_all_middleware
    from middleware.rate_limiter import limiter
    from services import docs_service, link_service, llm_service, pdf_service, storage_service, user_service, email_service
    from services.user_service import ALGORITHM, SECRET_KEY

logger = logging.getLogger(__name__)


def init_database() -> None:
    try:
        models.Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        logger.exception("Database initialization failed. The API will start, but DB-backed routes may fail.")


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_database()
    yield


app = FastAPI(lifespan=lifespan, **docs_service.get_app_docs_config())
docs_service.attach_custom_openapi(app)

dotenv.load_dotenv()  # Load environment variables from .env file
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "")
allow_origins = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",")] if ALLOWED_ORIGINS_ENV else ["*"]

# CORS setup for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins, 
    allow_credentials=True if "*" not in allow_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all middleware (rate limiter, security headers, logging, etc.)
register_all_middleware(app)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(request: Request, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Verify JWT and return current logged-in user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception

    # Store user ID on request state for per-user rate limiting
    request.state.current_user_id = user.id
    return user


# ---------------------------------------------------------
# HEALTH CHECK (ALB / uptime monitoring)
# ---------------------------------------------------------

@app.get("/health", tags=["Infrastructure"])
def health_check():
    """Lightweight health endpoint for ALB and uptime monitors."""
    return {"status": "ok"}


# ---------------------------------------------------------
# AUTHENTICATION ROUTES
# ---------------------------------------------------------

@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED, tags=["Authentication"])
@limiter.limit("3/minute")
def register_user(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user and send OTP."""
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    # 1. Base User
    new_user = models.User(full_name=user.full_name, email=user.email, is_verified=False, auth_type="email")
    db.add(new_user)
    db.flush() # Get user ID
    
    # 2. Email Auth Credentials
    hashed_pwd = user_service.get_password_hash(user.password)
    otp_code = f"{random.randint(100000, 999999)}"
    otp_expires = datetime.utcnow() + timedelta(minutes=10)
    
    email_cred = models.EmailAuthCredential(
        user_id=new_user.id, 
        hashed_password=hashed_pwd,
        otp_code=otp_code,
        otp_expires_at=otp_expires
    )
    db.add(email_cred)
    db.commit()
    db.refresh(new_user)

    # 3. Send Email
    email_service.send_otp_email(new_user.email, otp_code)

    return new_user

@app.post("/verify-email", tags=["Authentication"])
@limiter.limit("5/minute")
def verify_email(request: Request, data: schemas.VerifyOTP, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or user.auth_type != "email":
        raise HTTPException(status_code=400, detail="Invalid user or auth method")
    
    if user.is_verified:
        return {"message": "Email already verified"}
    
    cred = db.query(models.EmailAuthCredential).filter(models.EmailAuthCredential.user_id == user.id).first()
    if not cred or cred.otp_code != data.otp or datetime.utcnow() > cred.otp_expires_at:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    user.is_verified = True
    cred.otp_code = None
    cred.otp_expires_at = None
    db.commit()
    
    auth_token = user_service.create_access_token(data={"sub": user.email, "name": user.full_name})
    return {"message": "Email verified successfully", "access_token": auth_token, "token_type": "bearer"}

@app.post("/login", response_model=schemas.Token, tags=["Authentication"])
@limiter.limit("5/minute")
def login_user(request: Request, user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT."""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or db_user.auth_type != "email":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})
    
    cred = db.query(models.EmailAuthCredential).filter(models.EmailAuthCredential.user_id == db_user.id).first()
    if not cred or not user_service.verify_password(user.password, cred.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})
        
    if not db_user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first.")
    
    access_token = user_service.create_access_token(data={"sub": db_user.email, "name": db_user.full_name})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/send-reset-otp", tags=["Authentication"])
@limiter.limit("5/minute")
def request_password_reset(request: Request, data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == data.email).first()
    
    # Do not leak whether the email exists or not to prevent user enumeration
    if not db_user or db_user.auth_type != "email":
        return {"message": "If that email is registered, a reset link will be sent."}
    
    # Generate OTP
    otp_code = f"{random.randint(100000, 999999)}"
    otp_expires = datetime.utcnow() + timedelta(minutes=10)
    
    cred = db.query(models.EmailAuthCredential).filter(models.EmailAuthCredential.user_id == db_user.id).first()
    if cred:
        cred.otp_code = otp_code
        cred.otp_expires_at = otp_expires
        db.commit()
        email_service.send_password_reset_email(db_user.email, otp_code)
        
    return {"message": "If that email is registered, a reset link will be sent."}

@app.post("/auth/reset-password", tags=["Authentication"])
@limiter.limit("5/minute")
def reset_password(request: Request, data: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == data.email).first()
    if not db_user or db_user.auth_type != "email":
        raise HTTPException(status_code=400, detail="Invalid request")
        
    cred = db.query(models.EmailAuthCredential).filter(models.EmailAuthCredential.user_id == db_user.id).first()
    
    # Check OTP validity
    if not cred or cred.otp_code != data.otp or not cred.otp_expires_at or datetime.utcnow() > cred.otp_expires_at:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    # Successfully verified OTP, update password
    cred.hashed_password = user_service.get_password_hash(data.new_password)
    cred.otp_code = None
    cred.otp_expires_at = None
    db.commit()
    
    return {"message": "Password successfully reset."}

@app.post("/auth/google", response_model=schemas.Token, tags=["Authentication"])
@limiter.limit("10/minute")
def google_auth(request: Request, data: schemas.GoogleLogin, db: Session = Depends(get_db)):
    # With useGoogleLogin, we receive an access_token, not an id_token.
    # We verify it by asking Google for the user's profile.
    userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    
    response = requests.get(userinfo_url, headers={"Authorization": f"Bearer {data.token}"})
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")
        
    idinfo = response.json()
    email = idinfo.get('email')
    name = idinfo.get('name', '')
    google_id = idinfo.get('sub')
    
    if not email or not google_id:
        raise HTTPException(status_code=400, detail="Incomplete profile data from Google")

    # Look up user
    db_user = db.query(models.User).filter(models.User.email == email).first()
    
    if db_user:
        if db_user.auth_type != "google":
            raise HTTPException(status_code=400, detail="Email already registered with a different method. Please login with your password.")
    else:
        # Create Google User
        db_user = models.User(full_name=name, email=email, is_verified=True, auth_type="google")
        db.add(db_user)
        db.flush()
        
        google_cred = models.GoogleAuthCredential(user_id=db_user.id, google_id=google_id)
        db.add(google_cred)
        db.commit()
        db.refresh(db_user)

    access_token = user_service.create_access_token(data={"sub": db_user.email, "name": db_user.full_name})
    return {"access_token": access_token, "token_type": "bearer"}


# ---------------------------------------------------------
# CORE AI ROUTES
# ---------------------------------------------------------

@app.post("/analyze-claim", tags=["Analysis"])
@limiter.limit("10/minute")
def analyze_claim(request: Request, claim_request: schemas.ClaimRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Analyze a claim using LLM, save to DB, and return data + download link."""
    
    analysis_result = llm_service.analyze_claim_with_context_tree(
        claim_request.claim,
        db=db,
        user_id=current_user.id,
    )
    analysis_report_str = json.dumps(analysis_result)

    new_chat = models.Chat(
        claim=claim_request.claim,
        analysis_report=analysis_report_str,
        user_id=current_user.id
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    pdf_url = link_service.get_pdf_download_link(new_chat.id)

    return {
        "id": new_chat.id,
        "claim": new_chat.claim,
        "report": analysis_result, 
        "pdf_download_link": pdf_url  
    }

@app.get("/history", response_model=List[schemas.ChatHistoryResponse], tags=["History"])
@limiter.limit("30/minute")
def get_user_history(request: Request, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch user's past analyzed claims."""
    return db.query(models.Chat).filter(models.Chat.user_id == current_user.id).order_by(models.Chat.created_at.desc()).all()

@app.delete("/history/{chat_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["History"])
@limiter.limit("20/minute")
def delete_chat(request: Request, chat_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a chat from user's history."""
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or unauthorized")

    if getattr(chat, "pdf_storage_path", None) and storage_service.is_storage_enabled():
        try:
            storage_service.remove_report_pdf(chat.pdf_storage_path)
        except Exception:
            logger.exception("Failed to remove PDF from Supabase Storage for chat_id=%s", chat_id)

    db.delete(chat)
    db.commit()
    return None


# ---------------------------------------------------------
# DOWNLOAD REPORT ROUTE
# ---------------------------------------------------------



@app.get("/report/{chat_id}/download", tags=["Reports"])
@limiter.limit("15/minute")
def download_pdf_report(
    request: Request,
    chat_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate and download a PDF report for a specific chat."""

    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Report not found or unauthorized")

    safe_claim = re.sub(r'[^a-zA-Z0-9]', '_', chat.claim)[:40].strip('_')
    filename = f"NuanceNode_Report_{safe_claim}.pdf"

    if getattr(chat, "pdf_storage_path", None) and storage_service.is_storage_enabled():
        try:
            pdf_bytes = storage_service.download_report_pdf(chat.pdf_storage_path)
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{filename}"'},
            )
        except Exception:
            logger.exception("Failed to download PDF from Supabase Storage for chat_id=%s", chat_id)
    
    try:
        report_data = json.loads(chat.analysis_report)
    except Exception:
        raise HTTPException(status_code=500, detail="Stored report data is corrupted.")

    try:
        pdf_bytes = pdf_service.generate_pdf_bytes(chat.id, chat.claim, report_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

    if storage_service.is_storage_enabled():
        storage_path = getattr(chat, "pdf_storage_path", None) or storage_service.build_report_storage_path(current_user.id, chat.id)
        try:
            storage_service.upload_report_pdf(storage_path, pdf_bytes)
            if getattr(chat, "pdf_storage_path", None) != storage_path:
                chat.pdf_storage_path = storage_path
                db.add(chat)
                db.commit()
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{filename}"'},
            )
        except Exception:
            logger.exception("Failed to upload PDF to Supabase Storage for chat_id=%s", chat_id)

    try:
        pdf_path = pdf_service.generate_pdf_report(chat.id, chat.claim, report_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to persist local PDF: {str(e)}")

    if not pdf_path.exists():
        raise HTTPException(status_code=500, detail="PDF generation failed")

    return FileResponse(
        path=pdf_path,
        filename=filename,
        media_type="application/pdf"
    )


@app.get("/openapi/download.json", tags=["Documentation"])
def download_openapi_json():
    return docs_service.build_openapi_json_response(app)


@app.get("/openapi/download.yaml", tags=["Documentation"])
def download_openapi_yaml():
    return docs_service.build_openapi_yaml_response(app)
