from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String)
    address: Mapped[str] = mapped_column(String)
    city: Mapped[str] = mapped_column(String)
    province: Mapped[str] = mapped_column(String)
    country: Mapped[str] = mapped_column(String)
    postal_code: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=datetime.utcnow
    )
    # Relationship
    contacts: Mapped[list["Contact"]] = relationship(
        "Contact", back_populates="company"
    )


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String, index=True)
    last_name: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String)
    address: Mapped[str] = mapped_column(String)
    city: Mapped[str] = mapped_column(String)
    province: Mapped[str] = mapped_column(String)
    country: Mapped[str] = mapped_column(String)
    postal_code: Mapped[str] = mapped_column(String)
    company_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("companies.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=datetime.utcnow
    )
    # Relationship
    company: Mapped[Optional["Company"]] = relationship(
        "Company", back_populates="contacts"
    )
