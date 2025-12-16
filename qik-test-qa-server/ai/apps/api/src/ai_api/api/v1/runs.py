"""GET /v1/runs/{id} — статус."""

from fastapi import APIRouter, HTTPException
from libs.agents.orchestrator.orchestrator import Orchestrator

router = APIRouter()


@router.get("/runs/{run_id}")
def get_run(run_id: str):
    """
    Get run status by run_id.
    
    Args:
        run_id: Run identifier
        
    Returns:
        Run status dictionary
        
    Raises:
        HTTPException: 404 if run not found
    """
    run_data = Orchestrator.get_run(run_id)
    
    if run_data is None:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return run_data
