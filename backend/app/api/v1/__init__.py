from fastapi import APIRouter
from .companies import router as companies_router
from .contacts import router as contacts_router
from .dashboard import router as dashboard_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(companies_router, prefix="/companies", tags=["companies"])
api_router.include_router(contacts_router, prefix="/contacts", tags=["contacts"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
