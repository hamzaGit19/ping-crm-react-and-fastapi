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
    {
        "name": "Acme Corp",
        "email": "contact@acmecorp.com",
        "phone": "+1 (212) 555-0123",
        "address": "123 Broadway",
        "city": "New York",
        "province": "New York",
        "country": "United States",
        "postal_code": "10007",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Stark Industries",
        "email": "info@stark.com",
        "phone": "+1 (310) 555-0124",
        "address": "10880 Malibu Point",
        "city": "Los Angeles",
        "province": "California",
        "country": "United States",
        "postal_code": "90265",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Wayne Enterprises",
        "email": "contact@wayne.com",
        "phone": "+1 (201) 555-0125",
        "address": "1007 Mountain Drive",
        "city": "Gotham",
        "province": "New Jersey",
        "country": "United States",
        "postal_code": "07001",
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
