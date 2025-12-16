"""Simple lint validator placeholder."""

from typing import Tuple
from pathlib import Path


def lint_file(path: str) -> Tuple[bool, str]:
    """
    Lightweight lint stub.
    - Checks file exists.
    - For .py ensures non-empty content.
    """
    p = Path(path)
    if not p.exists():
        return False, f"File not found: {path}"
    content = p.read_text(encoding="utf-8")
    if p.suffix == ".py" and not content.strip():
        return False, "Empty python file"
    return True, ""
