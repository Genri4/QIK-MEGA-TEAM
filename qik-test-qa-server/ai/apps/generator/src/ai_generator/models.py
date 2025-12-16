"""Models for generation requests and responses."""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum


class GenerationStatus(str, Enum):
    """Status of generation process."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class GenerationRequest(BaseModel):
    """Request model for text generation by prompt."""
    
    prompt: str = Field(..., description="Text prompt for generation", min_length=1)
    context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional context data (e.g., user data, previous results)"
    )
    options: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Generation options (temperature, max_tokens, etc.)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Generate test cases for user authentication endpoint",
                "context": {"endpoint": "/api/v1/auth/login", "method": "POST"},
                "options": {"temperature": 0.7, "max_tokens": 1000}
            }
        }


class GenerationResponse(BaseModel):
    """Response model for generation result."""
    
    result: str = Field(..., description="Generated text result")
    status: GenerationStatus = Field(default=GenerationStatus.COMPLETED, description="Generation status")
    agent_source: str = Field(default="AI Generator Service", description="Source agent identifier")
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional metadata about generation (tokens used, model, etc.)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "result": "Generated test cases...",
                "status": "completed",
                "agent_source": "AI Generator Service",
                "metadata": {"tokens_used": 150, "model": "gpt-4"}
            }
        }


class ErrorResponse(BaseModel):
    """Error response model."""
    
    error: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Additional error details")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid prompt format",
                "details": {"field": "prompt", "reason": "Empty string not allowed"}
            }
        }

