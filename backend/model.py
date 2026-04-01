from sqlalchemy import Column, Integer, String, Boolean, DateTime
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