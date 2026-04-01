from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import model
import schema
from database import engine, get_db

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hello, World!"}


@app.get("/records")
def get_records(db: Session = Depends(get_db)):
    return db.query(model.LendingRecord).all()


@app.post("/records")
def create_record(record: schema.RecordCreate, db: Session = Depends(get_db)):
    db_record = model.LendingRecord(
        name = record.name,
        type = record.type,
        content = record.content,
        amount = record.amount
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@app.patch("/records/{record_id}/complete", response_model=schema.RecordResponse)
def complete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(model.LendingRecord).filter(model.LendingRecord.id == record_id).first()
    if not db_record:
        return {"error": "Record not found"}

    db_record.is_complete = True
    db.commit()
    db.refresh(db_record)
    return db_record


@app.delete("/records/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(model.LendingRecord).filter(model.LendingRecord.id == record_id).first()
    if not db_record:
        return {"error": "Record not found"}

    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}