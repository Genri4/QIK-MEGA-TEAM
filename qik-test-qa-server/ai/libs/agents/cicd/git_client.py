"""Lightweight Git + GitHub helper used by the NATS CICD handler."""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Iterable, Mapping, Optional, Sequence, Tuple
from urllib.parse import urlparse

import httpx


class GitClientError(RuntimeError):
    """Raised when a git or GitHub operation fails."""


class GitClient:
    """Imperative git wrapper with minimal dependencies (uses git CLI)."""

    def __init__(
        self,
        token: Optional[str],
        api_url: str,
        allowed_hosts: Tuple[str, ...],
    ) -> None:
        self.token = token
        self.api_url = api_url.rstrip("/")
        self.allowed_hosts = allowed_hosts

        # ----- locate git executable -----
        # 1) explicit override via env var (convenient for CI / local manual override)
        git_path = os.environ.get("GIT_PATH")

        # 2) try PATH (shutil.which)
        if not git_path:
            git_path = shutil.which("git")

        # 3) common Windows install locations (fallback)
        if not git_path and os.name == "nt":
            possible = [
                r"C:\Program Files\Git\cmd\git.exe",
                r"C:\Program Files\Git\bin\git.exe",
                r"C:\Program Files (x86)\Git\cmd\git.exe",
                r"C:\Program Files (x86)\Git\bin\git.exe",
            ]
            for p in possible:
                if os.path.exists(p):
                    git_path = p
                    break

        # 4) common UNIX locations (fallback)
        if not git_path and os.name != "nt":
            possible_unix = ["/usr/bin/git", "/usr/local/bin/git", "/snap/bin/git"]
            for p in possible_unix:
                if os.path.exists(p):
                    git_path = p
                    break

        self.git_path = git_path

        if not self.git_path:
            # fail early with clear message so caller can fallback or user can install git
            raise GitClientError(
                "git executable not found. Install Git or set GIT_PATH environment variable "
                "(e.g. C:\\\\Program Files\\\\Git\\\\cmd\\\\git.exe on Windows)."
            )

    # ------------- filesystem helpers -------------
    def make_temp_workdir(self, prefix: str) -> Path:
        path = Path(tempfile.mkdtemp(prefix=f"{prefix}_"))
        return path

    # ------------- git helpers -------------
    def clone(self, repo_url: str, dest: Path, depth: int = 1) -> Path:
        """
        Clone repo into dest. Returns the actual repo directory path.
        
        Note: git clone creates a subdirectory, so if dest=/tmp/foo and repo=bar,
        the actual repo will be at /tmp/foo/bar/. This method returns that path.
        """
        self._ensure_allowed_repo(repo_url)
        dest.mkdir(parents=True, exist_ok=True)
        # Extract repo name from URL (last component without .git)
        repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "")
        repo_path = dest / repo_name
        
        # If repo already exists, remove it first
        if repo_path.exists():
            import shutil
            shutil.rmtree(repo_path, ignore_errors=True)
        
        self._run_git(["clone", f"--depth={depth}", repo_url, str(repo_path)])
        return repo_path

    def create_branch(self, repo_path: Path, branch: str, base: str = "origin/main") -> None:
        """
        Create or reset branch.
        If remote branch exists, base on origin/<branch> to avoid non-fast-forward issues.
        """
        # fetch remote branch if exists
        try:
            self._run_git(["-C", str(repo_path), "fetch", "origin", branch])
            remote_ref = f"origin/{branch}"
            self._run_git(["-C", str(repo_path), "checkout", "-B", branch, remote_ref])
        except GitClientError:
            # fallback to base
            self._run_git(["-C", str(repo_path), "checkout", "-B", branch, base])

    def apply_files(self, repo_path: Path, files: Iterable[Mapping[str, str]]) -> None:
        """Write provided files (path, content) into the repo."""
        for file_obj in files:
            rel_path = file_obj["path"]
            content = file_obj["content"]
            target_path = repo_path / rel_path
            target_path.parent.mkdir(parents=True, exist_ok=True)
            target_path.write_text(content, encoding="utf-8")

    def copy_artifact(self, artifact_path: Path, target_rel: str, repo_path: Path) -> None:
        target_path = repo_path / target_rel
        target_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(artifact_path, target_path)

    def commit_all(self, repo_path: Path, message: str) -> None:
        self._run_git(["-C", str(repo_path), "add", "."])
        self._run_git(["-C", str(repo_path), "commit", "-m", message])

    def push(self, repo_path: Path, repo_url: str, branch: str) -> None:
        self._ensure_allowed_repo(repo_url)
        if not self.token:
            raise GitClientError("Missing GITHUB_PAT; cannot push")
        parsed = urlparse(repo_url)
        safe_netloc = f"{self.token}:x-oauth-basic@{parsed.netloc}"
        remote_with_token = parsed._replace(netloc=safe_netloc).geturl()
        env = os.environ.copy()
        env.pop("GITHUB_PAT", None)  # avoid accidental leak
        self._run_git(
            ["-C", str(repo_path), "push", remote_with_token, f"HEAD:{branch}"],
            env=env,
        )

    def diff(self, repo_path: Path) -> str:
        """Get diff of staged and unstaged changes."""
        # Get staged changes (cached)
        staged = self._run_git_capture(["-C", str(repo_path), "diff", "--cached"]) or ""
        # Get unstaged changes
        unstaged = self._run_git_capture(["-C", str(repo_path), "diff"]) or ""
        combined = (staged + unstaged).strip()
        if not combined:
            # If no diff, check status to see what's happening
            status = self._run_git_capture(["-C", str(repo_path), "status", "--short"])
            if status.strip():
                # There are changes but diff is empty - try diff against HEAD
                try:
                    return self._run_git_capture(["-C", str(repo_path), "diff", "HEAD"])
                except GitClientError:
                    pass
        return combined

    # ------------- GitHub API -------------
    def create_pr(
        self,
        owner: str,
        repo: str,
        head: str,
        base: str,
        title: str,
        body: str,
    ) -> str:
        if not self.token:
            raise GitClientError("Missing GITHUB_PAT; cannot create PR")
        url = f"{self.api_url}/repos/{owner}/{repo}/pulls"
        headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github+json",
        }
        payload = {"title": title, "head": head, "base": base, "body": body}
        resp = httpx.post(url, headers=headers, json=payload, timeout=30)
        if resp.status_code >= 300:
            raise GitClientError(f"PR create failed: {resp.status_code} {resp.text}")
        return resp.json().get("html_url", "")

    # ------------- internal helpers -------------
    def _ensure_allowed_repo(self, repo_url: str) -> None:
        host = urlparse(repo_url).hostname
        if not host or host not in self.allowed_hosts:
            raise GitClientError(f"Repo host not allowed: {host}")

    def _resolve_cmd(self, args: Sequence[str]) -> list:
        """
        Ensure the command starts with git executable path.
        If args already start with a git path or 'git', keep as-is.
        Otherwise prepend self.git_path.
        """
        if not args:
            return [self.git_path]

        first = args[0]
        # if first looks like git or is the full git path, keep args as-is
        if (
            first == "git"
            or os.path.basename(first).lower() == "git"
            or first.lower().endswith("git.exe")
            or first == self.git_path
        ):
            return list(args)
        # otherwise prepend git executable
        return [self.git_path, *list(args)]

    def _run_git(self, args: Sequence[str], env: Optional[dict] = None) -> None:
        full_args = self._resolve_cmd(args)
        env = env or os.environ.copy()
        try:
            subprocess.run(full_args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env, text=True)
        except subprocess.CalledProcessError as exc:
            stderr = exc.stderr or ""
            raise GitClientError(stderr.strip() or str(exc)) from exc
        except FileNotFoundError as exc:
            # unexpected — defensive
            raise GitClientError(f"git executable not found at {self.git_path}") from exc

    def _run_git_capture(self, args: Sequence[str]) -> str:
        full_args = self._resolve_cmd(args)
        try:
            proc = subprocess.run(full_args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            return proc.stdout or ""
        except subprocess.CalledProcessError as exc:
            stderr = exc.stderr or ""
            raise GitClientError(stderr.strip() or str(exc)) from exc
        except FileNotFoundError as exc:
            raise GitClientError(f"git executable not found at {self.git_path}") from exc
