"""Объединяет v1 роуты."""

from fastapi import APIRouter
from ai_api.api.v1 import generate, runs

# Create main router
router = APIRouter()

# Include v1 routers with prefix /v1
router.include_router(generate.router, prefix="/v1", tags=["v1"])
router.include_router(runs.router, prefix="/v1", tags=["v1"])
