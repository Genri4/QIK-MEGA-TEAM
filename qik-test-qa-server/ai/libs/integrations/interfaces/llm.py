"""Protocol LLMService (generate, stream)."""

from typing import Protocol


class LLMService(Protocol):
    """Protocol for LLM service - sync and async API for M3."""
    
    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        """
        Generate text based on prompt.
        
        Args:
            prompt: Text prompt for generation
            max_tokens: Maximum tokens to generate (default: 512)
            
        Returns:
            Generated text as string
        """
        ...

    async def agenerate(self, prompt: str, max_tokens: int = 512) -> str:
        """
        Async generation of text.
        """
        ...
