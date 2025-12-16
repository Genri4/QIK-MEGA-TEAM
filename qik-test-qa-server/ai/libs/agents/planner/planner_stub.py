"""Simple planner stub for M2."""

from typing import List, Dict


class PlannerStub:
    """Minimal planner that creates one step per endpoint."""

    def plan(self, endpoints: List[Dict[str, str]]) -> List[str]:
        steps: List[str] = []
        for endpoint in endpoints:
            path = endpoint.get("path", "")
            method = endpoint.get("method", "").upper()
            steps.append(f"generate pytest for {method} {path}")
        return steps

