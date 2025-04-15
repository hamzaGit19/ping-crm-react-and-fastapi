from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class ContactBase(BaseModel):
    name: str
    phone: str
    city: str
    company_id: Optional[int] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(ContactBase):
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None


class Contact(ContactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
