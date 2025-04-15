from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List, Optional
from app.database import get_db
from app.models import Company
from app.schemas.company import CompanyCreate, CompanyUpdate, Company as CompanySchema
from app.schemas.pagination import PaginatedResponse
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[CompanySchema])
async def list_companies(
    search: Optional[str] = None,
    city: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Build the base query
    query = select(Company)

    # Apply filters
    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    if city:
        query = query.filter(Company.city.ilike(f"%{city}%"))

    # Get total count
    count_query = select(func.count()).select_from(query)
    total = db.execute(count_query).scalar()

    # Apply pagination
    offset = (page - 1) * size
    query = query.offset(offset).limit(size)

    # Execute query
    result = db.execute(query)
    companies = result.scalars().all()

    # Return paginated response
    return PaginatedResponse.create(items=companies, total=total, page=page, size=size)


@router.post("/", response_model=CompanySchema)
async def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    try:
        company_data = company.model_dump()
        # Set both timestamps to current time
        current_time = datetime.utcnow()
        company_data["created_at"] = current_time
        company_data["updated_at"] = current_time

        print("Processed company data:", company_data)
        db_company = Company(**company_data)
        print("Created company instance:", db_company.__dict__)
        db.add(db_company)
        db.commit()
        db.refresh(db_company)
        return db_company
    except Exception as e:
        db.rollback()
        print("Error creating company:", str(e))
        print("Error type:", type(e).__name__)
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{company_id}", response_model=CompanySchema)
async def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.put("/{company_id}", response_model=CompanySchema)
async def update_company(
    company_id: int, company_update: CompanyUpdate, db: Session = Depends(get_db)
):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    for field, value in company_update.model_dump(exclude_unset=True).items():
        setattr(company, field, value)

    try:
        db.commit()
        db.refresh(company)
        return company
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{company_id}")
async def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    try:
        db.delete(company)
        db.commit()
        return {"message": "Company deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
