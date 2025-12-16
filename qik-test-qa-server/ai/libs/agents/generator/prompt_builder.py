"""Prompt builder using Jinja2 templates."""

from pathlib import Path
from typing import List, Dict, Any, Optional

from jinja2 import Environment, FileSystemLoader, select_autoescape, Template

from libs.shared.config import settings


class PromptBuilder:
    """Builds LLM prompts for test generation."""

    def __init__(self, template_name: str = "generate_test_prompt.j2"):
        templates_dir = (
            Path(__file__).parent.parent.parent.parent / "packages" / "prompt_templates"
        ).resolve()
        self.env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            autoescape=select_autoescape(enabled_extensions=("j2",)),
            trim_blocks=True,
            lstrip_blocks=True,
        )
        self.template_name = template_name

    def build(
        self,
        plan: List[str],
        endpoints: List[Dict[str, str]],
        spec: Optional[Dict[str, Any]] = None,
        max_tests_per_endpoint: Optional[int] = None,
        context: Optional[Dict[str, Any]] = None,
        template_name: Optional[str] = None,
    ) -> str:
        """Render prompt from plan and endpoints."""
        template_to_use = template_name or self.template_name
        template: Template = self.env.get_template(template_to_use)
        summary = f"{len(endpoints)} endpoints"
        max_tests = max_tests_per_endpoint or settings.MAX_TESTS_PER_ENDPOINT
        return template.render(
            summary=summary,
            plan=plan,
            endpoints=endpoints,
            spec=spec or {},
            context=context or {},
            max_tests_per_endpoint=max_tests,
        )
