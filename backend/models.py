import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

try:
    from .database import Base
except ImportError:
    from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # Relationship: 1 user : n chats. Delete chats on deleting user (cascade delete) 
    chats = relationship("Chat", back_populates="owner", cascade="all, delete-orphan")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    claim = Column(Text, nullable=False)             # Fake news text by user
    analysis_report = Column(Text, nullable=True)    # GenAI JSON/Text report
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign Key: Connecting chat to its owner (User)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)

    # Relationship: Each chat belongs to one user. Back-populates to "chats" in User model.
    owner = relationship("User", back_populates="chats")
