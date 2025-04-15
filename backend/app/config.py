from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://hamza@localhost:5432/pingcrm"
    DB_ECHO: bool = True  # Set to True to see SQL queries

    class Config:
        env_file = ".env"


settings = Settings()
