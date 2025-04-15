from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import select
from app.database import get_db, engine, Base
from app.models import User
from app.api.v1 import contacts

# from sqlalchemy import text
# from app.database import get_db

app = FastAPI(
    title="Ping CRM API",
    description="Backend API for Ping CRM application",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(contacts.router, prefix="/api/v1/contacts", tags=["contacts"])


@app.get("/")
async def root():
    return {"message": "Welcome to Ping CRM API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/users")
async def get_users(db: Session = Depends(get_db)):
    query = select(User)
    result = db.execute(query)
    users = result.scalars().all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }
        for user in users
    ]
