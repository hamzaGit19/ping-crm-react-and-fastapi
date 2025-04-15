import sys
import os

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Contact
from app.database import Base

# Use your actual database URL
DATABASE_URL = "postgresql://hamza@localhost:5432/pingcrm"

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Get current timestamp
now = datetime.utcnow()

# Sample contact data
contacts = [
    {
        "name": "John Doe",
        "phone": "+1-555-123-4567",
        "city": "New York",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Jane Smith",
        "phone": "+1-555-234-5678",
        "city": "San Francisco",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Bob Johnson",
        "phone": "+1-555-345-6789",
        "city": "Chicago",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Alice Brown",
        "phone": "+1-555-456-7890",
        "city": "Los Angeles",
        "created_at": now,
        "updated_at": now,
    },
]

# Insert contacts
for contact_data in contacts:
    contact = Contact(**contact_data)
    db.add(contact)

try:
    db.commit()
    print("Successfully added sample contacts!")
except Exception as e:
    db.rollback()
    print(f"Error adding contacts: {str(e)}")
finally:
    db.close()
