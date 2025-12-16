"""Async NATS controller that wires generate + commit/push flows."""

from __future__ import annotations

import asyncio
import json
import logging
from functools import partial
from typing import Any, Dict

from nats.aio.client import Client as NATS

from libs.agents.cicd.git_client import GitClient
from libs.agents.cicd.handler import CICDHandler
from libs.shared.config import settings
from libs.systems.llm.local_llm_stub import LocalLLMStub
from libs.systems.llm.qwen_client import QwenLLMClient

logger = logging.getLogger(__name__)

SUBJECT_GENERATE = "ai.generate_tests"
SUBJECT_COMMIT_PUSH = "ai.cicd.commit_push"


class NATSController:
    """Binds NATS subjects to CICD handler methods."""

    def __init__(self) -> None:
        self.nc = NATS()
        self.llm = self._build_llm()
        self.git_client = GitClient(
            token=settings.GITHUB_PAT,
            api_url=settings.GITHUB_API_URL,
            allowed_hosts=settings.GIT_ALLOWED_HOSTS,
        )

    async def start(self) -> None:
        await self.nc.connect(servers=[settings.NATS_URL])
        logger.info("Connected to NATS at %s", settings.NATS_URL)
        await self.nc.subscribe(SUBJECT_GENERATE, cb=self._wrap_handler(self._handle_generate))
        await self.nc.subscribe(SUBJECT_COMMIT_PUSH, cb=self._wrap_handler(self._handle_commit_push))
        await asyncio.Event().wait()

    def _wrap_handler(self, func):
        async def _cb(msg):
            try:
                payload = json.loads(msg.data.decode())
            except Exception:
                logger.error("Invalid JSON payload")
                return
            callback_subject = payload.get("callback_subject")
            request_id = payload.get("request_id") or payload.get("run_id") or "unknown"
            subject = callback_subject or f"ai.events.{request_id}"
            publish = partial(self._publish, subject)
            handler = CICDHandler(self.llm, self.git_client, publish)
            await func(handler, payload)

        return _cb

    async def _handle_generate(self, handler: CICDHandler, payload: Dict[str, Any]) -> None:
        await handler.handle_generate(payload)

    async def _handle_commit_push(self, handler: CICDHandler, payload: Dict[str, Any]) -> None:
        await handler.handle_commit_push(payload)

    async def _publish(self, subject: str, payload: Dict[str, Any]) -> None:
        try:
            await self.nc.publish(subject, json.dumps(payload).encode())
        except Exception:  # pragma: no cover - network issues
            logger.exception("Failed to publish to %s", subject)

    def _build_llm(self):
        """Choose between real Qwen and local stub based on settings."""
        if settings.USE_REAL_LLM or settings.LLM_API_KEY:
            try:
                return QwenLLMClient()
            except Exception as exc:  # pragma: no cover - defensive
                logger.error("Falling back to LocalLLMStub due to LLM init error: %s", exc)
        return LocalLLMStub()


async def run() -> None:
    controller = NATSController()
    await controller.start()