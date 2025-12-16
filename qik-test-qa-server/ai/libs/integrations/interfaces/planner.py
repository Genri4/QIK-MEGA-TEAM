"""Protocol PlannerService."""

from typing import Protocol, List, Dict


class PlannerService(Protocol):
    """Protocol for planner service."""

    def plan(self, endpoints: List[Dict[str, str]]) -> List[str]:
        """Return list of steps for generation."""
        ...

