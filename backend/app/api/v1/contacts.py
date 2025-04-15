from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List, Optional
from app.database import get_db
from app.models import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, Contact as ContactSchema
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[ContactSchema])
def list_contacts(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
):
    query = select(Contact)

    if search:
        search_filter = (
            Contact.first_name.ilike(f"%{search}%")
            | Contact.last_name.ilike(f"%{search}%")
            | Contact.email.ilike(f"%{search}%")
        )
        query = query.where(search_filter)

    # Calculate total and pages
    total = db.scalar(select(func.count()).select_from(query.subquery()))
    pages = (total + size - 1) // size

    # Apply pagination
    offset = (page - 1) * size
    query = query.offset(offset).limit(size)

    contacts = db.scalars(query).all()
    return {"items": contacts, "total": total, "pages": pages}


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
