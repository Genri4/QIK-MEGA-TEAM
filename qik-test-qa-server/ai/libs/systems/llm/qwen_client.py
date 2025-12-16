"""Qwen LLM client (async httpx) with sync wrapper and basic retries."""

import asyncio
import json
import random
from typing import Optional, Dict, Any

import httpx

from libs.shared.config import settings
from libs.integrations.interfaces.llm import LLMService


class LLMError(RuntimeError):
    """LLM specific error."""


class QwenLLMClient(LLMService):
    """Qwen LLM client with async HTTP implementation."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        timeout: int = 30,
        max_retries: int = 3,
        backoff_base: float = 0.5,
    ):
        self.api_key = api_key or settings.LLM_API_KEY
        # Base URL handling: if user passed /v1 (without chat/completions) — append it
        raw_base = base_url or settings.LLM_BASE_URL
        if raw_base:
            if raw_base.rstrip("/").endswith("/v1"):
                raw_base = raw_base.rstrip("/") + "/chat/completions"
        self.base_url = raw_base or "https://foundation-models.api.cloud.ru/v1/chat/completions"
        self.model = model or settings.LLM_MODEL
        self.temperature = temperature if temperature is not None else settings.LLM_TEMPERATURE
        self.top_p = top_p if top_p is not None else settings.LLM_TOP_P
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_base = backoff_base

        if not self.api_key:
            raise LLMError("LLM API key is not configured (LLM_API_KEY).")

    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        """Sync wrapper over async generate.

        NOTE: This wrapper always runs the async coroutine in a *new* event loop
        using asyncio.run(). We rely on callers that may be in an async context
        to call this function from a separate thread (we enforce that in handler).
        """
        return asyncio.run(self.agenerate(prompt, max_tokens=max_tokens))

    async def agenerate(self, prompt: str, max_tokens: int = 512) -> str:
        """Async generate request to Qwen API."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": self.temperature,
            "top_p": self.top_p,
        }

        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    resp = await client.post(self.base_url, json=payload, headers=headers)
                    resp.raise_for_status()
                    data = resp.json()
                    # Attempt to extract text from typical response shapes
                    choices = data.get("choices") or []
                    if choices and isinstance(choices[0], dict) and "message" in choices[0]:
                        text = choices[0]["message"].get("content")
                    else:
                        text = data.get("text") or data.get("result") or data.get("data")
                    if text is None:
                        raise LLMError(f"Unexpected LLM response: {json.dumps(data)[:500]}")
                    return text
            except (httpx.HTTPError, LLMError) as e:
                last_error = e
                if attempt >= self.max_retries:
                    break
                await asyncio.sleep(self.backoff_base * (2 ** (attempt - 1)) + random.random() * 0.1)

        raise LLMError(f"LLM request failed after retries: {last_error}")
