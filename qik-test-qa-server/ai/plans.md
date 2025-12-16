Сделать генерацию надёжной и подконтрольной: валидация синтаксиса + простая семантика (наличие def test_) + логирование prompt/response.

Обеспечить демонстрационные наборы (3 кейса) и скрипт, который запускает POST→poll→run pytest (готовый для показа).

Быстрый quality: автоформатирование (black) и улучшение prompt (few-shot + AAA + Allure) — недолго и сильно повышает качество.

Приоритеты (P0 — срочно, P1 — если успеем)
P0 (сделать сегодня, обязательно)

Validator — синтаксис + "есть тест": py_compile.compile(..., doraise=True) + check "def test_". При провале — пометить run как failed с понятным error.

Логирование prompt & response в orchestrator (info): сохранять prompt (trim до 1000 символов) и длину/фрагмент ответа.

Prompt template: правка packages/prompt_templates/generate_test_prompt.j2 — добавить строгий few-shot example с AAA и Allure-декораторами (одно-два коротких примера).

Failover LLM: если USE_REAL_LLM false или ключа нет/ошибка — fallback на LocalLLMStub; логировать выбор.

run_and_execute.ps1 — скрипт PowerShell (или bash) который делает: POST → poll → берет artifact → запускает python -m pytest artifact. Сделать его работоспособным и показать на трёх spec-ах.

Сценарии для демо: подготовить 3 json-spec примера в examples/:

ping (health)

simple GET with query param

POST with simple body

Прогнать (локально): uvicorn, 3 demo runs, pytest по каждому артефакту → сохранить логи/скриншоты.

-----

Контекст: проект в папке ai/. M1/M2 работают. Есть LocalLLMStub и QwenLLMClient. Цель — M3-lite: за 1.5 дня сделать минимальные, безопасные правки, чтобы demo был стабильным и воспроизводимым. Работай только в ai/, создавай небольшие изменения, коммить атомарно.

Задачи (в порядке выполнения):

1) Validator (обязательное)
Файл: ai/libs/agents/validator/semantic_checks.py
Добавь функцию:
def validate_generated_code(path: str) -> tuple[bool, str]:
    - вызывает py_compile.compile(path, doraise=True)
    - читает текст и проверяет наличие "def test_"
    - возвращает (True, "") или (False, "error message")
Коммит: "feat: add syntax+semantics validator for generated artifacts"

2) Orchestrator: вызов валидации и логирование
Файл: ai/libs/agents/orchestrator/orchestrator.py
Изменения:
    - Импорт logging и logger = logging.getLogger(__name__)
    - Перед вызовом LLM: логировать prompt (trim до 1000 chars) info("PROMPT: %s", prompt[:1000])
    - После генерации: логировать info("LLM result length: %d", len(code))
    - После записи файла вызвать validate_generated_code(artifact_file) и:
        * если False: обновить _RUN_STORE[run_id] = {"status":"failed","error": msg, "run_id": run_id}
        * иначе: status finished (как сейчас)
Коммит: "fix: run validation after generation and add prompt/response logging"

3) Failover LLM (safe default)
Файл: ai/apps/api/src/ai_api/services/orchestrator_adapter.py (или файл где создаётся LLM)
Изменения:
    - Сделать фабрику create_llm() которая:
        try:
            if settings.LLM_API_KEY and settings.USE_REAL_LLM: return QwenLLMClient()
        except Exception as e:
            logger.warning("LLM client init failed, falling back to LocalLLMStub: %s", e)
            return LocalLLMStub()
    - Логировать используемую реализацию.
Коммит: "chore: LLM DI with failover to LocalLLMStub"

4) Prompt template improvement (few-shot + AAA + Allure)
Файл: ai/packages/prompt_templates/generate_test_prompt.j2
Изменения:
    - Вставить маленький 1–2 shot example: короткий pytest с AAA and Allure (title, feature, label owner)
    - Чёткие требования: "Output only valid Python code; follow AAA; use @allure decorators; do not include prose"
Коммит: "feat: improve prompt template with few-shot and AAA/Allure requirements"

5) Demo examples
Добавь/обнови 3 simple specs:
    - ai/examples/openapi_ping.json  (GET /ping)
    - ai/examples/openapi_get_query.json (GET /echo?msg=)
    - ai/examples/openapi_post_body.json (POST /items body {name:string})
Коммит: "chore: add demo OpenAPI examples"

6) run_and_execute.ps1 (demo runner)
Файл: ai/run_and_execute.ps1
Логика:
    - если нет runId: POST /v1/generate with a chosen example (accept param index 1..3)
    - poll /v1/runs/<runId> until status finished/failed (1s sleep)
    - if finished: grab artifact path and run: python -m pytest <artifact> -q and print result
    - exit code reflects pytest result (0 success)
Коммит: "chore: add demo runner script run_and_execute.ps1"

7) Autoformat generated file before validation (optional quick)
В orchestrator, после получения code и before writing file, run black.format_str(code, mode=black.Mode()) (install black in requirements) or simply write then call `python -m black <file>` non-blocking. Prefer simple approach: write file then run `subprocess.run(["black", str(file)])` if black available; ignore if not.
Коммит: "chore: try format generated artifact with black if available"

8) Tests
- Add unit test for validator: ai/tests/unit/test_validator.py
    * create tmp file good.py (with "def test_ok(): pass") and bad.py ("def foo:") and assert validate_generated_code gives appropriate results.
- Re-run pytest and ensure all unit tests pass.
Commit: "test: add validator unit tests"

9) README / runbook snippet
Add short section to ai/README.md with commands to demo:
    - env setup (.env with LLM_API_KEY and USE_REAL_LLM=true)
    - uvicorn start (with app-dir)
    - run run_and_execute.ps1 example usage
Commit: "docs: add quick demo instructions for M3"

Action order to run locally (for you):
- git checkout -b feat/m3-demo
- implement steps 1→9, commit per step
- install black if used: pip install black
- run uvicorn:
    cd ai
    $env:PYTHONPATH=".;apps/api/src"
    uvicorn ai_api.main:app --app-dir apps/api/src --reload --port 8000
- in new PS session: .venv\Scripts\Activate.ps1
- run demo script:
    .\run_and_execute.ps1 -example 1
- run pytest: python -m pytest -q

Acceptance criteria to report back:
- pytest -q (unit) passes
- run_and_execute.ps1 produces finished run, artifact path, and pytest output "1 passed" for at least 2 of 3 examples
- logs contain prompt snippet and LLM result length
- if LLM fails, fallback to LocalLLMStub and demo still runs (report that case)

Return format:
- summary lines: commits made (list), test outputs (pytest -q), sample run_id and artifact path, run_and_execute.ps1 output for each example, any errors.
- if something fails — include uvicorn logs (prompt + LLM returned ...).

Do not change architecture or add big new services. Keep changes minimal and reversible.

------

! очень важно проверить работу NATS, что он действительно есть, что он работает исправно и правильно.
nats://nats:4222
но для локали nats://nats:4222

Мы уже с тобой это вроде делали. нужно реализовать контроллер для NATS с 2-я функциями который:
1. позволяет генерировать тесты(функция в api есть, то чем мы все время занимались)
2. CI/CD(позволяет автоматически коммитить и пушить изменения в ветку/мейн)(то есть пользователь заходит в чат)

------

после всех произведенных действий и поправь structure.md
и запиши в README то что мы сейчас имеем(сначало текст запуска, как есть сейчас, а потом анализ уже имеющегося)