from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
from app.database import get_db
from app.models import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, Contact as ContactSchema

router = APIRouter()


@router.get("/", response_model=List[ContactSchema])
async def list_contacts(
    search: Optional[str] = None,
    city: Optional[str] = None,
    company_id: Optional[int] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = select(Contact)

    if search:
        query = query.filter(Contact.name.ilike(f"%{search}%"))
    if city:
        query = query.filter(Contact.city.ilike(f"%{city}%"))
    if company_id:
        query = query.filter(Contact.company_id == company_id)

    query = query.offset(skip).limit(limit)
    result = db.execute(query)
    contacts = result.scalars().all()
    return contacts


@router.post("/", response_model=ContactSchema)
async def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    try:
        db.commit()
        db.refresh(db_contact)
        return db_contact
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{contact_id}", response_model=ContactSchema)
async def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.put("/{contact_id}", response_model=ContactSchema)
async def update_contact(
    contact_id: int, contact_update: ContactUpdate, db: Session = Depends(get_db)
):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    for field, value in contact_update.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)

    try:
        db.commit()
        db.refresh(contact)
        return contact
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{contact_id}")
async def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    try:
        db.delete(contact)
        db.commit()
        return {"message": "Contact deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
