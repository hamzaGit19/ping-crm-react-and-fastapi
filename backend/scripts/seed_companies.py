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
        "name": "TechCorp Solutions",
        "email": "contact@techcorp.com",
        "phone": "+1 (415) 555-0101",
        "address": "123 Innovation Drive",
        "city": "San Francisco",
        "province": "California",
        "country": "United States",
        "postal_code": "94105",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Global Dynamics Inc",
        "email": "info@globaldynamics.com",
        "phone": "+1 (212) 555-0102",
        "address": "456 Wall Street",
        "city": "New York",
        "province": "New York",
        "country": "United States",
        "postal_code": "10005",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "EcoSmart Systems",
        "email": "hello@ecosmart.com",
        "phone": "+1 (206) 555-0103",
        "address": "789 Green Avenue",
        "city": "Seattle",
        "province": "Washington",
        "country": "United States",
        "postal_code": "98101",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Quantum Industries",
        "email": "info@quantum-ind.com",
        "phone": "+1 (512) 555-0104",
        "address": "321 Tech Parkway",
        "city": "Austin",
        "province": "Texas",
        "country": "United States",
        "postal_code": "78701",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "DataFlow Analytics",
        "email": "contact@dataflow.io",
        "phone": "+1 (617) 555-0105",
        "address": "567 Data Drive",
        "city": "Boston",
        "province": "Massachusetts",
        "country": "United States",
        "postal_code": "02110",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "CloudNet Services",
        "email": "support@cloudnet.com",
        "phone": "+1 (303) 555-0106",
        "address": "890 Cloud Lane",
        "city": "Denver",
        "province": "Colorado",
        "country": "United States",
        "postal_code": "80202",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "BioTech Research",
        "email": "research@biotech.com",
        "phone": "+1 (858) 555-0107",
        "address": "432 Science Park",
        "city": "San Diego",
        "province": "California",
        "country": "United States",
        "postal_code": "92121",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Smart Energy Co",
        "email": "info@smartenergy.com",
        "phone": "+1 (713) 555-0108",
        "address": "765 Power Road",
        "city": "Houston",
        "province": "Texas",
        "country": "United States",
        "postal_code": "77002",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "Digital Dynamics",
        "email": "hello@digitaldyn.com",
        "phone": "+1 (312) 555-0109",
        "address": "987 Digital Drive",
        "city": "Chicago",
        "province": "Illinois",
        "country": "United States",
        "postal_code": "60601",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "InnovateTech Solutions",
        "email": "contact@innovatetech.com",
        "phone": "+1 (404) 555-0110",
        "address": "654 Innovation Way",
        "city": "Atlanta",
        "province": "Georgia",
        "country": "United States",
        "postal_code": "30303",
        "created_at": now,
        "updated_at": now,
    },
    # More companies...
    {
        "name": "Future Systems Inc",
        "email": "info@futuresys.com",
        "phone": "+1 (305) 555-0111",
        "address": "321 Future Lane",
        "city": "Miami",
        "province": "Florida",
        "country": "United States",
        "postal_code": "33101",
        "created_at": now,
        "updated_at": now,
    },
    {
        "name": "AI Solutions Group",
        "email": "contact@aisolutions.com",
        "phone": "+1 (702) 555-0112",
        "address": "456 AI Boulevard",
        "city": "Las Vegas",
        "province": "Nevada",
        "country": "United States",
        "postal_code": "89101",
        "created_at": now,
        "updated_at": now,
    },
    # Generate more companies programmatically
] + [
    {
        "name": f"Company {i}",
        "email": f"contact{i}@company{i}.com",
        "phone": f"+1 (555) 555-{i:04d}",
        "address": f"{i} Business Street",
        "city": [
            "New York",
            "Los Angeles",
            "Chicago",
            "Houston",
            "Phoenix",
            "Philadelphia",
            "San Antonio",
            "San Diego",
            "Dallas",
            "San Jose",
        ][i % 10],
        "province": [
            "New York",
            "California",
            "Illinois",
            "Texas",
            "Arizona",
            "Pennsylvania",
            "Texas",
            "California",
            "Texas",
            "California",
        ][i % 10],
        "country": "United States",
        "postal_code": f"{i:05d}",
        "created_at": now,
        "updated_at": now,
    }
    for i in range(38)  # This will add 38 more companies to reach 50 total
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
