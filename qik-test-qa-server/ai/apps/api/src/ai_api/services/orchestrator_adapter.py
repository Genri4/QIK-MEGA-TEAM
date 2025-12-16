"""Thin adapter: HTTP DTO -> libs.agents.orchestrator."""

import logging

from libs.shared.config import settings
from libs.systems.llm.local_llm_stub import LocalLLMStub
from libs.systems.llm.qwen_client import QwenLLMClient, LLMError
from libs.agents.orchestrator.orchestrator import Orchestrator

logger = logging.getLogger(__name__)


def create_orchestrator() -> Orchestrator:
    """
    Create orchestrator with selected LLM implementation.
    Falls back to LocalLLMStub if real LLM not configured or fails to init.
    """
    llm = None
    if settings.USE_REAL_LLM and settings.LLM_API_KEY:
        try:
            llm = QwenLLMClient()
            logger.info("Using QwenLLMClient as LLM backend")
        except Exception as e:  # pragma: no cover - init failure path
            logger.warning(f"Failed to init QwenLLMClient, fallback to LocalLLMStub: {e}")
            llm = None

    if llm is None:
        llm = LocalLLMStub()
        logger.info("Using LocalLLMStub as LLM backend")

    return Orchestrator(llm)
