"""Core: координатор шагов (Spec → Plan → Gen → ...)."""

import os
import uuid
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional, TYPE_CHECKING

from libs.shared.config import settings
from libs.agents.spec_loader.parser import parse_openapi
from libs.agents.planner.planner_stub import PlannerStub
from libs.agents.generator.prompt_builder import PromptBuilder
from libs.agents.validator.semantic_checks import validate_generated_code

if TYPE_CHECKING:
    from libs.integrations.interfaces.llm import LLMService

# In-memory run store for M1
_RUN_STORE: Dict[str, Dict[str, Any]] = {}
logger = logging.getLogger(__name__)


class Orchestrator:
    """
    Simple synchronous orchestrator for M1.
    
    Coordinates the pipeline: parse spec → build prompt → call LLM → save artifact.
    """
    
    def __init__(self, llm: "LLMService"):
        """
        Initialize orchestrator.
        
        Args:
            llm: LLM service instance (must implement LLMService protocol)
        """
        self.llm = llm
        # Resolve artifacts directory (make absolute to avoid relative path issues)
        artifacts_dir = Path(settings.ARTIFACTS_DIR)
        if not artifacts_dir.is_absolute():
            artifacts_dir = (Path.cwd() / artifacts_dir).resolve()
        self.artifacts_dir = artifacts_dir
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)
    
    def start_run(
        self,
        spec: Dict[str, Any],
        run_id: Optional[str] = None,
        mode: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Start a new generation run.
        
        Synchronous function that:
        1. Generates run_id
        2. Parses OpenAPI spec
        3. Builds prompt
        4. Calls LLM
        5. Saves artifact to filesystem
        6. Updates run store
        
        Args:
            spec: OpenAPI specification dictionary
            
        Args:
            spec: OpenAPI specification dictionary
            run_id: Optional run identifier (used when caller wants to return id immediately)
            
        Returns:
            Run ID string
        """
        # Generate run_id if not provided
        run_id = run_id or str(uuid.uuid4())
        
        # Register run in store
        _RUN_STORE[run_id] = {
            "status": "running",
            "spec": spec
        }
        
        try:
            # Parse OpenAPI spec (if provided). For manual cases we can pass empty endpoints.
            endpoints = parse_openapi(spec) if spec else []

            # Plan generation steps
            planner = PlannerStub()
            plan = planner.plan(endpoints)

            # Choose template based on mode
            template_name = self._resolve_template(mode)

            # Build prompt using template
            prompt_builder = PromptBuilder(template_name=template_name)
            prompt = prompt_builder.build(
                plan=plan,
                endpoints=endpoints,
                spec=spec,
                context=context or {},
                template_name=template_name,
            )
            logger.info("PROMPT: %s", prompt[:1000])
            
            # Call LLM
            code_raw = self.llm.generate(prompt)
            code = self._extract_code_block(code_raw).strip() or code_raw.strip()
            logger.info("LLM result length: %d", len(code))
            
            # Create run directory
            run_dir = self.artifacts_dir / run_id
            run_dir.mkdir(parents=True, exist_ok=True)

            # Determine file extension by mode
            suffix = ".md" if mode in {"manual_ui", "manual_api"} else ".py"
            artifact_file = run_dir / f"generated_{run_id}{suffix}"
            artifact_file.write_text(code, encoding="utf-8")

            # Optional format with black if available
            try:
                subprocess.run(
                    ["black", str(artifact_file)],
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
            except Exception:
                pass

            # Validate generated code
            is_valid, validation_error = validate_generated_code(str(artifact_file))
            if not is_valid:
                _RUN_STORE[run_id] = {
                    "status": "failed",
                    "error": validation_error,
                    "run_id": run_id
                }
                return run_id
            
            # Store artifact path (absolute for robustness)
            rel_path = str(artifact_file)
            
            # Update run store
            _RUN_STORE[run_id] = {
                "status": "finished",
                "artifact": rel_path,
                "run_id": run_id
            }
            
        except Exception as e:
            # Update run store with error
            _RUN_STORE[run_id] = {
                "status": "failed",
                "error": str(e),
                "run_id": run_id
            }
            raise
        
        return run_id
    
    @staticmethod
    def get_run(run_id: str) -> Optional[Dict[str, Any]]:
        """
        Get run status by run_id.
        
        Args:
            run_id: Run identifier
            
        Returns:
            Run dictionary or None if not found
        """
        return _RUN_STORE.get(run_id)

    def _build_prompt_from_plan(self, plan):
        """
        Build prompt string from plan steps.
        """
        return "\n".join(plan)

    @staticmethod
    def _extract_code_block(text: str) -> str:
        """
        Extract first code block from markdown fences if present.
        Strips ``` and optional language header (e.g., ```python).
        """
        if "```" not in text:
            return text

        parts = text.split("```")
        # code blocks are in odd indices
        for i in range(1, len(parts), 2):
            block = parts[i]
            lines = block.splitlines()
            if lines and lines[0].strip().lower().startswith(("python", "py")):
                lines = lines[1:]
            cleaned = "\n".join(lines).strip()
            if cleaned:
                return cleaned

        return text

    @staticmethod
    def _resolve_template(mode: Optional[str]) -> str:
        mapping = {
            "manual_ui": "manual_ui_cases.j2",
            "manual_api": "manual_api_cases.j2",
            "e2e": "e2e_playwright.j2",
            "api_tests": "api_pytest.j2",
        }
        return mapping.get(mode, "generate_test_prompt.j2")
