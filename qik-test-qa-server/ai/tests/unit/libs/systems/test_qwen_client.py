"""Tests for QwenLLMClient."""

import asyncio
import httpx
import pytest

from libs.systems.llm.qwen_client import QwenLLMClient, LLMError
from libs.shared.config import settings


class MockResponse:
    def __init__(self, status_code=200, data=None, request=None):
        self.status_code = status_code
        self._data = data or {}
        self._request = request or httpx.Request("POST", "http://test")

    def raise_for_status(self):
        if self.status_code >= 400:
            raise httpx.HTTPStatusError("error", request=self._request, response=httpx.Response(self.status_code))

    def json(self):
        return self._data


def test_qwen_client_agenerate_success(monkeypatch):
    settings.LLM_API_KEY = "test-key"
    called = {}

    async def mock_post(self, url, json=None, headers=None):
        called["json"] = json
        return MockResponse(data={"choices": [{"message": {"content": "hello"}}]})

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post, raising=False)

    client = QwenLLMClient(api_key="test-key", base_url="http://qwen.test/chat/completions", model="m1")
    result = asyncio.run(client.agenerate("prompt"))
    assert result == "hello"
    assert called["json"]["messages"][0]["content"] == "prompt"
    assert called["json"]["model"] == "m1"


def test_qwen_client_base_url_autofix():
    # If base_url ends with /v1, client should append /chat/completions
    settings.LLM_API_KEY = "test-key"
    client = QwenLLMClient(api_key="test-key", base_url="https://foundation-models.api.cloud.ru/v1")
    assert client.base_url.endswith("/v1/chat/completions")


def test_qwen_client_agenerate_http_error(monkeypatch):
    settings.LLM_API_KEY = "test-key"

    async def mock_post(self, url, json=None, headers=None):
        return MockResponse(status_code=500)

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post, raising=False)

    client = QwenLLMClient(api_key="test-key", base_url="http://qwen.test", max_retries=1)
    with pytest.raises(LLMError):
        asyncio.run(client.agenerate("prompt"))

