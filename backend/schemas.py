from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# -----------------------------
# 1. USER SCHEMAS (Auth)
# -----------------------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True  #Convert SQLAlchemy model to Pydantic model

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# -----------------------------
# 2. CHAT & AI SCHEMAS
# -----------------------------

class ClaimRequest(BaseModel):
    claim: str

class ClaimResponse(BaseModel):
    chat_id: int
    claim: str
    analysis_report: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    id: int
    claim: str
    created_at: datetime

    class Config:
        from_attributes = True