"""POST /v1/generate — старт пайплайна."""

from fastapi import APIRouter, BackgroundTasks, status
from pydantic import BaseModel
from typing import Dict, Any

import uuid
from ai_api.services.orchestrator_adapter import create_orchestrator

router = APIRouter()


class GenerateRequest(BaseModel):
    """Request model for generation endpoint."""
    openapi: Dict[str, Any]


@router.post("/generate/", status_code=status.HTTP_202_ACCEPTED)
def generate(
    request: GenerateRequest,
    background_tasks: BackgroundTasks
):
    """
    Start generation pipeline in background.
    
    Args:
        request: GenerateRequest with openapi specification
        background_tasks: FastAPI background tasks
        
    Returns:
        JSON with status "started"
    """
    orchestrator = create_orchestrator()

    # Pre-generate run_id to return immediately
    run_id = str(uuid.uuid4())

    # Add background task (background_tasks accepts sync callable)
    background_tasks.add_task(orchestrator.start_run, request.openapi, run_id)

    return {"status": "started", "run_id": run_id}
