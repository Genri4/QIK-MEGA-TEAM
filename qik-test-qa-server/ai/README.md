# AI Subproject — пошагово для запуска, проверки и демо

Цель: показать генерацию/валидацию
- 15+ ручных кейсов UI калькулятора (mode=manual_ui, .md)
- 15+ ручных кейсов API VMs/Disks/Flavors (mode=manual_api, .md)
- Авто E2E (Playwright+pytest, mode=e2e, .py)
- Авто API (pytest httpx/requests, mode=api_tests, .py)
- Валидация (.md/.py), интеграция с Qwen (Cloud.ru FM), NATS CICD dry-run/push

## 1. Подготовка окружения (локально)
```
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
Env (пример):
```
$env:NATS_URL="nats://nats:4222"
$env:USE_REAL_LLM="true"
$env:LLM_API_KEY="<qwen_api_key>"
$env:LLM_BASE_URL="https://foundation-models.api.cloud.ru/v1/chat/completions"
$env:LLM_MODEL="Qwen/Qwen3-Coder-480B-A35B-Instruct"
$env:GITHUB_PAT="<token_with_repo_rights>"   # нужно только для push/PR
```

## 2. Поднять NATS
Compose: docker compose -f deploy/compose.proxy.yml up -d nats  
Или Docker напрямую: docker run --rm -p 4222:4222 -p 8222:8222 nats:latest -DV  

Адреса: локально `nats://nats:4222`, в compose — `nats://nats:4222`.

## 3. Запуск воркера (NATS listener)
Из корня репо:
```
$env:PYTHONPATH="ai;ai\apps\worker\src"
python -m apps.worker.src.ai_worker.nats_worker
```
Логи: Connected to NATS; подписки на `ai.generate_tests`, `ai.cicd.commit_push`.

## 4. (Опционально) HTTP API /v1/generate
```
cd ai
$env:PYTHONPATH=".;apps/api/src"
uvicorn ai_api.main:app --app-dir apps/api/src --reload --port 8000
```

## 5. Генерация через NATS — основные payload
Топик: `ai.generate_tests`. Ответы — `callback_subject` или `ai.events.<request_id>`.

- Ручные UI (15+ кейсов):
```json
{
  "request_id": "req-ui-1",
  "spec": {},
  "mode": "manual_ui",
  "context": { "ui_notes": "см. case_detail.md, блоки калькулятора" },
  "callback_subject": "ai.responses.ui"
}
```
- Ручные API (15+ кейсов VMs/Disks/Flavors):
```json
{
  "request_id": "req-api-1",
  "spec": {},
  "mode": "manual_api",
  "context": { "api_notes": "VMs/Disks/Flavors, bearer auth, UUIDv4" },
  "callback_subject": "ai.responses.api"
}
```
- Авто E2E (Playwright+pytest):
```json
{
  "request_id": "req-e2e-1",
  "spec": { "openapi": "3.0.0", "info": { "title": "demo", "version": "1.0.0" }, "paths": {} },
  "mode": "e2e",
  "context": { "ui_notes": "главная, каталог, конфигурация compute, mobile" },
  "callback_subject": "ai.responses.e2e"
}
```
- Авто API (pytest httpx/requests):
```json
{
  "request_id": "req-apit-1",
  "spec": { "openapi": "3.0.0", "info": { "title": "compute", "version": "1.0.0" }, "paths": {} },
  "mode": "api_tests",
  "context": { "api_notes": "VMs/Disks/Flavors, позитив/негатив, bearer" },
  "callback_subject": "ai.responses.apit"
}

run_id генерируется воркером и приходит в callback. Его нужно использовать для CICD push.

```
Результат: `run_id`, `artifact_path`, `preview`. `.md` для manual_*, `.py` для e2e/api_tests.

## 6. CICD через NATS (dry-run / push / PR)
Топик: `ai.cicd.commit_push`.
Пример (dry-run diff):
```json
{
  "request_id": "cicd-xxxx",
  "run_id": "<run_id_from_generate>",
  "repo": "https://github.com/owner/repo.git",
  "branch": "ai/generated/<run_id>",
  "target_branch": "main",
  "commit_message": "Add AI generated tests",
  "create_pr": true,
  "dry_run": true,
  "callback_subject": "ai.responses.cicd"
}
```
События: `committing` → `preview(diff)` → `finished`.  
Для пуша: `dry_run:false`, нужен `GITHUB_PAT`. Если ветка существует — берите новую или убедитесь, что origin свежий (fetch уже выполняется). 

## 7. Проверка требований (что смотреть)
- UI manual: .md, ≥15 кейсов, ID/Title/Preconditions/Steps/Expected, RU.
- API manual: .md, ≥15 кейсов, VMs/Disks/Flavors, позитив/негатив.
- E2E: .py, ≥5 сценариев, Playwright+pytest, Allure, AAA.
- API autotests: .py, 8–10 тестов, httpx/requests, Allure, AAA, позитив/негатив (401/404/400).
- Валидация: semantic_checks — .md не пуст и содержит заголовки; .py компилируется и содержит test_.
- Qwen: при LLM_API_KEY/USE_REAL_LLM=true используется реальный клиент; иначе LocalLLMStub.
- Docker: NATS в `deploy/compose.proxy.yml`; остальные сервисы без изменений. Воркера сейчас вручную (можно добавить сервис по аналогии).
- Документация/примеры: README, `structure.md`, `case_detail.md`, `ai/nats_publish_*.py`.
- Демо: NATS + воркер, четыре generate (manual_ui/manual_api/e2e/api_tests), затем cicd dry-run; при токене — push/PR.

## 8. Мини-сценарий для лайв-демо (PowerShell)
```
# NATS
docker run --rm -p 4222:4222 -p 8222:8222 nats:latest -DV

# Env
$env:NATS_URL="nats://nats:4222"
$env:USE_REAL_LLM="true"
$env:LLM_API_KEY="<qwen_key>"
$env:GITHUB_PAT="<token>"   # если нужен push

# Воркера
cd D:\hackaton\cloude_ru_track_2\qik-test-qa-server
.venv\Scripts\Activate.ps1
$env:PYTHONPATH="ai;ai\apps\worker\src"
python -m apps.worker.src.ai_worker.nats_worker

# Generate (пример manual_ui)
python ai\nats_publish_generate.py   # или свой скрипт с mode/manual_ui

# CICD dry-run
python ai\nats_publish_cicd_preview.py
```

## 9. Ключевые файлы
- Шаблоны: `packages/prompt_templates/` (manual_ui/manual_api/e2e/api_tests).
- Оркестратор: `libs/agents/orchestrator/orchestrator.py` (mode → шаблон, .md/.py).
- NATS: `libs/integrations/nats_controller.py`.
- CICD: `libs/agents/cicd/handler.py`, `git_client.py`.
- Валидаторы: `libs/agents/validator/semantic_checks.py`, `lint.py`.
- Примеры NATS: `ai/nats_publish_generate.py`, `ai/nats_publish_cicd_preview.py`, `ai/nats_subscribe.py`, `ai/nats_test.py`.

## 10. Ветки для push
Используйте уникальные ветки (`ai/generated/<run_id>`) чтобы избегать `fetch first`. Force-пуш не включён; перед пушем делается fetch origin/<branch> если ветка есть.