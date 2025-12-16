"""Tests for PromptBuilder."""

from libs.agents.generator.prompt_builder import PromptBuilder


def test_prompt_builder_renders_template():
    builder = PromptBuilder()
    plan = ["generate pytest for GET /ping"]
    endpoints = [{"path": "/ping", "method": "get"}]
    prompt = builder.build(plan=plan, endpoints=endpoints, spec={"info": {"title": "Test API"}})
    assert "GET" in prompt
    assert "/ping" in prompt
    assert "pytest" in prompt.lower()
    assert len(prompt.strip()) > 0

