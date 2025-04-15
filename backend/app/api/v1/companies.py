from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
from app.database import get_db
from app.models import Company
from app.schemas.company import CompanyCreate, CompanyUpdate, Company as CompanySchema

router = APIRouter()


@router.get("/", response_model=List[CompanySchema])
async def list_companies(
    search: Optional[str] = None,
    city: Optional[str] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = select(Company)

    if search:
        query = query.filter(Company.name.ilike(f"%{search}%"))
    if city:
        query = query.filter(Company.city.ilike(f"%{city}%"))

    query = query.offset(skip).limit(limit)
    result = db.execute(query)
    companies = result.scalars().all()
    return companies


@router.post("/", response_model=CompanySchema)
async def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    db_company = Company(**company.model_dump())
    db.add(db_company)
    try:
        db.commit()
        db.refresh(db_company)
        return db_company
    except Exception as e:
        db.rollback()
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
