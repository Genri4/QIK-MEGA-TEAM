"""Dev stub for local LLM."""

import logging

logger = logging.getLogger(__name__)


class LocalLLMStub:
    """
    Local LLM stub implementation for M1.
    
    Deterministic implementation that returns a simple pytest test script.
    """
    
    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        """
        Deterministic stub that returns mode-aware content to simplify local testing.
        """
        logger.info(f"LocalLLMStub.generate called with prompt: {prompt[:120]}...")

        lower = prompt.lower()

        # Manual UI cases (markdown)
        if "manual ui" in lower or "ui test cases" in lower:
            return """# Manual UI Cases
- ID: UI-001
  Title: Главная страница открывается
  Preconditions: Пользователь не авторизован
  Steps:
    1. Открыть /calculator
  Expected: Заголовок отображается, кнопка "Добавить сервис" активна
- ID: UI-002
  Title: Каталог продуктов — отображение категорий
  Preconditions: Открыт калькулятор
  Steps:
    1. Нажать "Добавить сервис"
  Expected: Категории Инфраструктура/Сети/Хранение видны
"""

        # Manual API cases (markdown)
        if "manual api" in lower or "api test cases" in lower:
            return """# Manual API Cases
- ID: API-VM-001
  Title: GET /vms возвращает 200
  Preconditions: Bearer токен валиден
  Steps:
    1. GET /vms
  Expected: 200, список ВМ, schema ok
- ID: API-VM-002
  Title: GET /vms с невалидным UUID
  Preconditions: Bearer токен валиден
  Steps:
    1. GET /vms/123
  Expected: 400 или 404
"""

        # E2E Playwright (pytest)
        if "playwright" in lower or "e2e" in lower:
            return """import pytest
import allure

@allure.feature("Calculator")
@allure.story("Start page")
@allure.title("Открытие калькулятора")
@allure.label("owner", "qa")
@pytest.mark.asyncio
async def test_open_calculator(page):
    # Arrange
    await page.goto("http://localhost:3000/calculator")
    # Act
    title = await page.text_content("text=Калькулятор")
    # Assert
    assert "Калькулятор" in title
"""

        # API pytest
        if "pytest api tests" in lower or "httpx" in lower:
            return """import httpx
import allure

BASE_URL = "https://compute.api.cloud.ru"
TOKEN = "fake-token"

def _headers():
    return {"Authorization": f"Bearer {TOKEN}"}

@allure.feature("VMs")
@allure.story("List VMs")
@allure.title("GET /vms returns 200")
@allure.label("owner", "qa")
def test_list_vms_ok():
    resp = httpx.get(f"{BASE_URL}/vms", headers=_headers())
    assert resp.status_code == 200
"""

        # Default minimal pytest
        return """import pytest

def test_dummy():
    assert 1 == 1
"""
