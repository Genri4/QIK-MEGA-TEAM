"""Integration-like test for Orchestrator end-to-end flow."""

from libs.systems.llm.local_llm_stub import LocalLLMStub
from libs.agents.orchestrator.orchestrator import Orchestrator
from libs.shared.config import settings
from pathlib import Path


def test_orchestrator_end_to_end(tmp_path, monkeypatch):
    # Use tmp artifacts directory to avoid polluting repo
    settings.ARTIFACTS_DIR = str(tmp_path / "ai_artifacts")

    llm = LocalLLMStub()
    orch = Orchestrator(llm)
    spec = {"paths": {"/ping": {"get": {}}}}

    run_id = orch.start_run(spec)
    run_data = Orchestrator.get_run(run_id)

    assert run_data is not None
    assert run_data["status"] == "finished"

    artifact_path = Path(run_data["artifact"])
    assert artifact_path.exists()
    assert artifact_path.is_file()
    content = artifact_path.read_text(encoding="utf-8")
    assert len(content.strip()) > 0

