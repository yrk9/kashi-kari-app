from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional

# フロントから受け取るデータのスキーマ
class RecordCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    type: str   # "モノか" or "カネか"
    content: str = Field(..., min_length=1, max_length=100)
    amount: Optional[int] = Field(None, ge=0)


class RecordUpdate(BaseModel):
    name: str
    type: str
    content: str
    amount: Optional[int] = None
    is_complete: bool


# データベースからフロントに返すデータのスキーマ
class RecordResponse(BaseModel):
    id: int
    name: str
    content: str
    amount: Optional[int]
    is_complete: bool
    created_at: datetime

    class Config:
        from_attributes = True