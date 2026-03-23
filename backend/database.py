import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "nuancenode_db")

# Connection String specifically for MySQL Connector
SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# Create the Engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SessionLocal class will be used to create actual database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our ORM models
Base = declarative_base()

# Dependency function for getting a database session. FastAPI will use this to provide a session to path operations.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()