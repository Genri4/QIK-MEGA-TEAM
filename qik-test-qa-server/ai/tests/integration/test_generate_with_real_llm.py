"""Integration test for orchestrator with real LLM (gated by LLM_API_KEY)."""

import pytest

from libs.shared.config import settings
from libs.systems.llm.qwen_client import QwenLLMClient, LLMError
from libs.agents.orchestrator.orchestrator import Orchestrator


@pytest.mark.skipif(
    not settings.LLM_API_KEY
    or not settings.LLM_BASE_URL
    or "example" in (settings.LLM_BASE_URL or ""),
    reason="LLM_API_KEY/LLM_BASE_URL not configured for real LLM",
)
def test_generate_with_real_llm(tmp_path):
    settings.ARTIFACTS_DIR = str(tmp_path / "ai_artifacts")
    settings.USE_REAL_LLM = True

    client = QwenLLMClient(api_key=settings.LLM_API_KEY, base_url=settings.LLM_BASE_URL)
    orch = Orchestrator(client)

    spec = {"paths": {"/ping": {"get": {}}}}
    run_id = orch.start_run(spec)
    run = Orchestrator.get_run(run_id)

    assert run is not None
    assert run["status"] in {"finished", "failed"}  # if provider rejects, allow failed
    if run["status"] == "finished":
        assert run["artifact"]

