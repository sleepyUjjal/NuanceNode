import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

try:
    from .database import Base
except ImportError:
    from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    full_name = Column(String(255), nullable=True, default="")
    email = Column(String(255), unique=True, index=True, nullable=False)
    is_verified = Column(Boolean, default=False)
    auth_type = Column(String(50), default="email")

    # Relationships
    chats = relationship("Chat", back_populates="owner", cascade="all, delete-orphan")
    email_auth = relationship("EmailAuthCredential", back_populates="user", uselist=False, cascade="all, delete-orphan")
    google_auth = relationship("GoogleAuthCredential", back_populates="user", uselist=False, cascade="all, delete-orphan")


class EmailAuthCredential(Base):
    __tablename__ = "email_auth_credentials"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    hashed_password = Column(String(255), nullable=False)
    otp_code = Column(String(10), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="email_auth")


class GoogleAuthCredential(Base):
    __tablename__ = "google_auth_credentials"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    google_id = Column(String(255), unique=True, nullable=False)

    user = relationship("User", back_populates="google_auth")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    claim = Column(Text, nullable=False)             # Fake news text by user
    analysis_report = Column(Text, nullable=True)    # GenAI JSON/Text report
    pdf_storage_path = Column(Text, nullable=True)   # Supabase Storage object path
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign Key: Connecting chat to its owner (User)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    # Relationship: Each chat belongs to one user. Back-populates to "chats" in User model.
    owner = relationship("User", back_populates="chats")
