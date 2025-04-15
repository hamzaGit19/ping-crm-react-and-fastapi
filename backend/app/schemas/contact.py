from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    province: str
    country: str
    postal_code: str
    company_id: Optional[int] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(ContactBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    company_id: Optional[int] = None


class Contact(ContactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
