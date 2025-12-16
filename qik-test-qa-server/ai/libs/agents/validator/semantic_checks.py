"""Semantic checks for generated code."""

from typing import Tuple
import py_compile
import re
from pathlib import Path


def validate_generated_code(path: str) -> Tuple[bool, str]:
    """
    Validate generated file.
    - For .py: syntax + at least one test_ function.
    - For .md: ensure non-empty and has at least one case title ("Case" or "Тест").
    """
    file_path = Path(path)
    if not file_path.exists():
        return False, f"File not found: {path}"

    content = file_path.read_text(encoding="utf-8")

    if file_path.suffix == ".md":
        if not content.strip():
            return False, "Empty markdown"
        if not re.search(r"(Case|Тест)", content, re.IGNORECASE):
            return False, "No test titles found in markdown"
        return True, ""

    try:
        py_compile.compile(str(file_path), doraise=True)
    except py_compile.PyCompileError as e:
        return False, f"Syntax error: {e}"

    if not re.search(r"def\s+test_", content):
        return False, "No test function found in generated code"

    return True, ""
