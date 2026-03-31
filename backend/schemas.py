from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# -----------------------------
# 1. USER SCHEMAS (Auth)
# -----------------------------

class UserCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

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
    model_config = ConfigDict(str_strip_whitespace=True)

    claim: str = Field(min_length=5, max_length=5000)

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
    analysis_report: str
    created_at: datetime

    class Config:
        from_attributes = True
