import asyncio
from pathlib import Path
from typing import Any, Dict, List

import pytest

from libs.agents.cicd.handler import CICDHandler
from libs.agents.cicd.git_client import GitClientError
from libs.systems.llm.local_llm_stub import LocalLLMStub


class DummyGitClient:
    def __init__(self, tmpdir: Path, diff_text: str = "diff") -> None:
        self.tmpdir = tmpdir
        self.diff_text = diff_text
        self.calls: List[str] = []

    def make_temp_workdir(self, prefix: str) -> Path:  # noqa: ARG002
        return self.tmpdir

    def clone(self, repo_url: str, dest: Path, depth: int = 1) -> None:  # noqa: ARG002
        self.calls.append("clone")
        dest.mkdir(parents=True, exist_ok=True)

    def apply_files(self, repo_path: Path, files):  # noqa: ARG002
        self.calls.append("apply_files")

    def copy_artifact(self, artifact_path: Path, target_rel: str, repo_path: Path) -> None:  # noqa: ARG002
        self.calls.append("copy_artifact")
        (repo_path / target_rel).parent.mkdir(parents=True, exist_ok=True)

    def create_branch(self, repo_path: Path, branch: str, base: str = "origin/main") -> None:  # noqa: ARG002
        self.calls.append("create_branch")

    def diff(self, repo_path: Path) -> str:  # noqa: ARG002
        self.calls.append("diff")
        return self.diff_text

    def commit_all(self, repo_path: Path, message: str) -> None:  # noqa: ARG002
        self.calls.append("commit_all")

    def push(self, repo_path: Path, repo_url: str, branch: str) -> None:  # noqa: ARG002
        self.calls.append("push")

    def create_pr(self, owner: str, repo: str, head: str, base: str, title: str, body: str) -> str:  # noqa: ARG002
        self.calls.append("create_pr")
        return "https://example.com/pr/1"


@pytest.mark.asyncio
async def test_handle_generate_success(tmp_path: Path):
    events: List[Dict[str, Any]] = []

    async def publish(_, payload):
        events.append(payload)

    git_client = DummyGitClient(tmp_path)
    handler = CICDHandler(LocalLLMStub(), git_client, publish)
    payload = {"request_id": "req-1", "spec": {"openapi": "3.0.0"}}

    await handler.handle_generate(payload)

    statuses = [e["status"] for e in events]
    assert "started" in statuses
    assert "finished" in statuses
    assert events[-1]["run_id"] == "req-1"


@pytest.mark.asyncio
async def test_commit_push_dry_run(tmp_path: Path):
    events: List[Dict[str, Any]] = []

    async def publish(_, payload):
        events.append(payload)

    git_client = DummyGitClient(tmp_path, diff_text="sample diff")
    handler = CICDHandler(LocalLLMStub(), git_client, publish)

    # provide finished run with artifact
    artifact = tmp_path / "artifact.py"
    artifact.write_text("print('hi')", encoding="utf-8")
    handler.orchestrator.get_run = lambda run_id: {  # type: ignore[attr-defined]
        "status": "finished",
        "artifact": str(artifact),
    }

    payload = {
        "request_id": "req-2",
        "run_id": "req-2",
        "repo": "https://github.com/acme/repo.git",
        "dry_run": True,
    }

    await handler.handle_commit_push(payload)

    statuses = [e["status"] for e in events]
    assert statuses[0] == "committing"
    assert "preview" in statuses
    assert events[-1]["diff"].startswith("sample diff")


@pytest.mark.asyncio
async def test_commit_push_missing_repo(tmp_path: Path):
    events: List[Dict[str, Any]] = []

    async def publish(_, payload):
        events.append(payload)

    git_client = DummyGitClient(tmp_path)
    handler = CICDHandler(LocalLLMStub(), git_client, publish)

    payload = {"request_id": "req-3"}
    await handler.handle_commit_push(payload)

    assert events[-1]["status"] == "failed"

