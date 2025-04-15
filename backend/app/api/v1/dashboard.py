from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Company, Contact

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_companies = db.scalar(func.count(Company.id))
    total_contacts = db.scalar(func.count(Contact.id))

    return {"total_companies": total_companies, "total_contacts": total_contacts}
