"""Core generator service with flat methods for integration."""

from typing import Dict, Any, Optional
from .models import GenerationRequest, GenerationResponse, GenerationStatus, ErrorResponse


class GeneratorService:
    """
    Core generator service with convenient flat methods for integration.
    
    This service provides the core functionality for prompt-based text generation.
    It's designed to be used by controllers (NATS, HTTP, etc.) and other services.
    """
    
    def __init__(self):
        """Initialize generator service."""
        # TODO: Initialize LLM client, load configuration, etc.
        pass
    
    async def generate_by_prompt(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> GenerationResponse:
        """
        Generate text based on prompt.
        
        Args:
            prompt: Text prompt for generation
            context: Optional additional context data
            options: Optional generation options
            
        Returns:
            GenerationResponse with generated result
            
        Raises:
            ValueError: If prompt is invalid
        """
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty")
        
        # TODO: Implement actual generation logic
        # 1. Build prompt with context if provided
        # 2. Call LLM service (libs.systems.llm or libs.integrations.interfaces.llm)
        # 3. Process and format response
        # 4. Return GenerationResponse
        
        # Placeholder implementation
        result_text = f"Generated response for prompt: {prompt[:50]}..."
        if context:
            result_text += f"\nContext: {context}"
        
        return GenerationResponse(
            result=result_text,
            status=GenerationStatus.COMPLETED,
            agent_source="AI Generator Service",
            metadata={
                "prompt_length": len(prompt),
                "has_context": context is not None,
                "options": options or {}
            }
        )
    
    async def generate_from_request(self, request: GenerationRequest) -> GenerationResponse:
        """
        Generate text from GenerationRequest model.
        
        Convenient method that accepts full request model.
        
        Args:
            request: GenerationRequest with prompt and optional context/options
            
        Returns:
            GenerationResponse with generated result
        """
        return await self.generate_by_prompt(
            prompt=request.prompt,
            context=request.context,
            options=request.options
        )
    
    async def generate_with_context(
        self,
        prompt: str,
        user_data: Optional[Dict[str, Any]] = None,
        additional_context: Optional[Dict[str, Any]] = None
    ) -> GenerationResponse:
        """
        Generate text with user data context.
        
        Convenient method for cases when we need to enrich prompt with user data.
        Useful for integration scenarios (e.g., from gate service).
        
        Args:
            prompt: Base prompt
            user_data: Optional user data to include in context
            additional_context: Optional additional context
            
        Returns:
            GenerationResponse with generated result
        """
        context = {}
        if user_data:
            context["user_data"] = user_data
        if additional_context:
            context.update(additional_context)
        
        return await self.generate_by_prompt(
            prompt=prompt,
            context=context if context else None
        )

