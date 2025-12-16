"""Unit tests for PlannerStub."""

from libs.agents.planner.planner_stub import PlannerStub


def test_planner_stub_basic():
    planner = PlannerStub()
    plan = planner.plan([{"path": "/ping", "method": "get"}])
    assert isinstance(plan, list)
    assert len(plan) == 1
    assert len(plan[0]) > 0
