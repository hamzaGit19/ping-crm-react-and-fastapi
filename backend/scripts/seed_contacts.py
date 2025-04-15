import sys
import os
import random

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from app.models import Contact, Company
from app.database import Base

# Use your actual database URL
DATABASE_URL = "postgresql://hamza@localhost:5432/pingcrm"

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Get current timestamp
now = datetime.utcnow()

# Get all company IDs
company_ids = [company.id for company in db.query(Company).all()]

# Sample contact data with company assignments
contacts = [
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-123-4567",
        "address": "123 Main St",
        "city": "New York",
        "province": "New York",
        "country": "United States",
        "postal_code": "10001",
        "company_id": company_ids[0] if company_ids else None,  # TechCorp Solutions
        "created_at": now,
        "updated_at": now,
    },
    {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+1-555-234-5678",
        "address": "456 Market St",
        "city": "San Francisco",
        "province": "California",
        "country": "United States",
        "postal_code": "94103",
        "company_id": company_ids[1]
        if len(company_ids) > 1
        else None,  # Global Dynamics Inc
        "created_at": now,
        "updated_at": now,
    },
    {
        "first_name": "Bob",
        "last_name": "Johnson",
        "email": "bob.johnson@example.com",
        "phone": "+1-555-345-6789",
        "address": "789 State St",
        "city": "Chicago",
        "province": "Illinois",
        "country": "United States",
        "postal_code": "60601",
        "company_id": company_ids[2]
        if len(company_ids) > 2
        else None,  # EcoSmart Systems
        "created_at": now,
        "updated_at": now,
    },
    {
        "first_name": "Alice",
        "last_name": "Brown",
        "email": "alice.brown@example.com",
        "phone": "+1-555-456-7890",
        "address": "321 Oak Ave",
        "city": "Los Angeles",
        "province": "California",
        "country": "United States",
        "postal_code": "90001",
        "company_id": company_ids[3]
        if len(company_ids) > 3
        else None,  # Quantum Industries
        "created_at": now,
        "updated_at": now,
    },
]

# Add more contacts with random company assignments
additional_contacts = []
for i in range(20):  # Adding 20 more contacts
    additional_contacts.append(
        {
            "first_name": f"Test{i}",
            "last_name": f"User{i}",
            "email": f"test.user{i}@example.com",
            "phone": f"+1-555-{i:03d}-{i:04d}",
            "address": f"{i} Test Street",
            "city": ["New York", "San Francisco", "Chicago", "Los Angeles", "Seattle"][
                i % 5
            ],
            "province": [
                "New York",
                "California",
                "Illinois",
                "California",
                "Washington",
            ][i % 5],
            "country": "United States",
            "postal_code": f"{10000 + i}",
            "company_id": random.choice(company_ids) if company_ids else None,
            "created_at": now,
            "updated_at": now,
        }
    )

contacts.extend(additional_contacts)

# First, clear existing contacts
db.query(Contact).delete()

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
