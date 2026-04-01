from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import model
from database import engine, get_db

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hello, World!"}


@app.get("/records")
def get_records(db: Session = Depends(get_db)):
    return db.query(model.LendingRecord).all()

    