"""Unit tests for orchestrator."""

import pytest
from pathlib import Path
from libs.systems.llm.local_llm_stub import LocalLLMStub
from libs.agents.orchestrator.orchestrator import Orchestrator
from libs.shared.config import settings


def test_orchestrator_start_run(tmp_path, monkeypatch):
    """Test orchestrator start_run method."""
    # isolate artifacts to temp dir
    settings.ARTIFACTS_DIR = str(tmp_path / "ai_artifacts")
    llm = LocalLLMStub()
    orchestrator = Orchestrator(llm)

    sample_spec = {
        "paths": {
            "/ping": {"get": {}}
        }
    }

    # Run orchestrator
    run_id = orchestrator.start_run(sample_spec)

    # run_id OK
    assert isinstance(run_id, str)
    assert len(run_id) > 0

    # get store entry
    run_data = Orchestrator.get_run(run_id)
    assert run_data is not None
    assert run_data["status"] == "finished"

    # artifact exists
    artifact_path = Path(run_data["artifact"])
    assert artifact_path.exists()
    assert artifact_path.is_file()

    # artifact content not empty
    content = artifact_path.read_text(encoding="utf-8")
    assert len(content.strip()) > 0, "Artifact file is empty, but should contain generated stub text"


def test_orchestrator_get_run_not_found():
    """Test orchestrator get_run with non-existent run_id."""
    result = Orchestrator.get_run("non-existent-id")
    assert result is None
