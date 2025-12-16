"""Tests for validate_generated_code."""

from pathlib import Path
from libs.agents.validator.semantic_checks import validate_generated_code


def test_validate_generated_code_ok(tmp_path):
    file_path = tmp_path / "ok.py"
    file_path.write_text("def test_ok():\n    assert 1 == 1\n", encoding="utf-8")
    ok, msg = validate_generated_code(str(file_path))
    assert ok is True
    assert msg == ""


def test_validate_generated_code_bad(tmp_path):
    file_path = tmp_path / "bad.py"
    file_path.write_text("def test_bad()\n    assert 1 == 1\n", encoding="utf-8")
    ok, msg = validate_generated_code(str(file_path))
    assert ok is False
    assert "Syntax error" in msg or "error" in msg

