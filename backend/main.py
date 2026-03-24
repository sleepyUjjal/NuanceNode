from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import json

# Import our independent modules
import models, schemas
from database import engine, get_db
from services import user_service, llm_service

# Create database tables based on our models (if they don't exist already)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NuanceNode API")

# CORS setup to allow frontend (running on different port) to access our API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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

@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """User Registration Endpoint"""
    # Check if email is already registered
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    hashed_pwd = user_service.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pwd)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """User Login Endpoint"""
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    # Verify password
    if not db_user or not user_service.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT Token
    access_token = user_service.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

from typing import List

@app.post("/analyze-claim", response_model=schemas.ClaimResponse)
def analyze_claim(request: schemas.ClaimRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Analyze a claim and save the result for the user."""
    # Process claim through LLM service
    analysis_result = llm_service.analyze_claim_with_context_tree(request.claim)
    
    # Needs to be saved as JSON string
    analysis_report_str = json.dumps(analysis_result)

    # Save to db
    new_chat = models.Chat(
        claim=request.claim,
        analysis_report=analysis_report_str,
        user_id=current_user.id
    )
    
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@app.get("/history", response_model=List[schemas.ChatHistoryResponse])
def get_user_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get the history of analyzed claims for the current user."""
    chats = db.query(models.Chat).filter(models.Chat.user_id == current_user.id).order_by(models.Chat.created_at.desc()).all()
    return chats