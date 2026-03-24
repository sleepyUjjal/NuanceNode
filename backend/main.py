import os
import json
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from jose import jwt, JWTError

# Internal modules
import models, schemas
from database import engine, get_db
from services import user_service, llm_service, pdf_service, link_service

# Initialize DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NuanceNode API")

# CORS setup for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Verify JWT and return current logged-in user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        from services.user_service import JWT_SECRET_KEY, JWT_ALGORITHM
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# ---------------------------------------------------------
# AUTHENTICATION ROUTES
# ---------------------------------------------------------

@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    hashed_pwd = user_service.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pwd)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Authenticate user and return JWT."""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not user_service.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = user_service.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# ---------------------------------------------------------
# CORE AI ROUTES
# ---------------------------------------------------------

@app.post("/analyze-claim")
def analyze_claim(request: schemas.ClaimRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Analyze a claim using LLM, save to DB, and return data + download link."""
    # 1. Analyze claim via LLM
    analysis_result = llm_service.analyze_claim_with_context_tree(request.claim)
    analysis_report_str = json.dumps(analysis_result)

    # 2. Save chat to database
    new_chat = models.Chat(
        claim=request.claim,
        analysis_report=analysis_report_str,
        user_id=current_user.id
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    # 3. Generate PDF download link via service
    pdf_url = link_service.get_pdf_download_link(new_chat.id)

    # 4. Return combined response
    return {
        "id": new_chat.id,
        "claim": new_chat.claim,
        "report": analysis_result, 
        "pdf_download_link": pdf_url  
    }

@app.get("/history", response_model=List[schemas.ChatHistoryResponse])
def get_user_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch user's past analyzed claims."""
    return db.query(models.Chat).filter(models.Chat.user_id == current_user.id).order_by(models.Chat.created_at.desc()).all()


# ---------------------------------------------------------
# DOWNLOAD REPORT ROUTE
# ---------------------------------------------------------

@app.get("/report/{chat_id}/download")
def download_pdf_report(
    chat_id: int, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Generate and download a PDF report for a specific chat."""
    # Fetch chat from DB
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Report not found or unauthorized")
    
    # Parse stored JSON
    try:
        report_data = json.loads(chat.analysis_report)
    except Exception:
        raise HTTPException(status_code=500, detail="Stored report data is corrupted.")

    # Generate PDF
    try:
        pdf_path = pdf_service.generate_pdf_report(chat.id, chat.claim, report_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

    # Return file response
    if os.path.exists(pdf_path):
        return FileResponse(
            path=pdf_path, 
            filename=f"NuanceNode_Report_{chat_id}.pdf", 
            media_type="application/pdf"
        )
    else:
        raise HTTPException(status_code=500, detail="PDF generation failed")