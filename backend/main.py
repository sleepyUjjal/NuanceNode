from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import our independent modules
import models, schemas
from database import engine, get_db
from services import user_service

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