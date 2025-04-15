from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .contact import Contact


class CompanyBase(BaseModel):
    name: str
    city: str


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(CompanyBase):
    name: Optional[str] = None
    city: Optional[str] = None


class Company(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime
    contacts: List[Contact] = []

    class Config:
        from_attributes = True
