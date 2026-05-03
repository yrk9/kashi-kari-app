from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

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


class Group(Base):
    __tablename__ = "groups"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    description = Column(String)
    total_amount = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"))
    payments = relationship("GroupPayment", back_populates="group")


class GroupPayment(Base):
    __tablename__ = "group_payments"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(String, ForeignKey("groups.id"))
    user_name = Column(String)
    amount = Column(Integer)

    group = relationship("Group", back_populates="payments")