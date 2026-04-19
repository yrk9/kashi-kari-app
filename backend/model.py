from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class LendingRecord(Base):
    __tablename__ = "lending_records"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)   # "モノか" or "カネか"
    name = Column(String)
    content = Column(String)
    amount = Column(Integer, nullable=True)
    is_complete = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="records")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    records = relationship("LendingRecord", back_populates="owner")