"""FastAPI application - создание FastAPI, подключение роутеров."""

import logging
from fastapi import FastAPI

from .router import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """
    Create and configure FastAPI application.
    
    Returns:
        Configured FastAPI app instance
    """
    app = FastAPI(
        title="AI API Service",
        description="AI service for test generation",
        version="0.1.0"
    )
    
    # Register router
    app.include_router(router)
    
    # Health endpoints
    @app.get("/health/live")
    def health_live():
        """Liveness probe."""
        return {"status": "ok"}
    
    @app.get("/health/ready")
    def health_ready():
        """Readiness probe."""
        return {"status": "ready"}
    
    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
