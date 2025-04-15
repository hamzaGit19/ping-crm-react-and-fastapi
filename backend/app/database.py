import datetime
from typing import AsyncGenerator

from sqlalchemy import DateTime, create_engine
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
)
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import settings


class Base(AsyncAttrs, DeclarativeBase):
    """Base class for all models"""

    type_annotation_map = {
        datetime.datetime: DateTime(timezone=True),
    }


# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    # New SQLAlchemy 2.0 recommended settings
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

# Session factory using 2.0 style
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # 2.0 recommended setting
)

# Create all tables
Base.metadata.create_all(bind=engine)


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
