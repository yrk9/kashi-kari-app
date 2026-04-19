from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import model
import schema
import auth
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173", # Reactの開発サーバー
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],         # すべてのメソッド（GET, POST, OPTIONS等）を許可
    allow_headers=["*"],         # すべてのヘッダーを許可
)

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


@app.put("/records/{record_id}")
def update_record(record_id: int, updated_record: schema.RecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(model.LendingRecord).filter(model.LendingRecord.id == record_id).first()

    if db_record is None:
        return HTTPException(status_code=404, detail="Record not found")

    db_record.name = updated_record.name
    db_record.content = updated_record.content
    db_record.amount = updated_record.amount
    db_record.type = updated_record.type
    db_record.is_complete = updated_record.is_complete

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

#ユーザ登録
@app.post("/signup", response_model=schema.User)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(model.User).filter(model.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = model.User(username=user.username, hashed_password=hashed_pwd)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


#ログイン
@app.post("/login", response_model=schema.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    user = db.query(model.User).filter(model.User.username == form_data.username).first()

    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="ユーザ名またはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
