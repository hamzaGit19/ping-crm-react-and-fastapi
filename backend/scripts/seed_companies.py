import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Company
from app.database import Base


DATABASE_URL = "postgresql://hamza@localhost:5432/pingcrm"

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

now = datetime.utcnow()

companies = [
    {"name": "Acme Corp", "city": "New York", "created_at": now, "updated_at": now},
    {
        "name": "Stark Industries",
        "city": "Los Angeles",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Wayne Enterprises",
        "city": "Gotham",
        "created_at": now,
        "updated_at": now,
    },
]

for company_data in companies:
    company = Company(**company_data)
    db.add(company)

try:
    db.commit()
    print("Successfully added sample companies!")
except Exception as e:
    db.rollback()
    print(f"Error adding companies: {str(e)}")
finally:
    db.close()
