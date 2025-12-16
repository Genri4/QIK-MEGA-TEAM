# ai/nats_publish_generate_ui.py
import asyncio, json
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://nats:4222")

    callback = "ai.responses.ui"
    done = asyncio.Event()

    async def cb(msg):
        data = json.loads(msg.data.decode())
        print("UI RESPONSE:", json.dumps(data, ensure_ascii=False))
        if data.get("status") in ("finished", "failed"):
            done.set()

    await nc.subscribe(callback, cb=cb)

    # подробное описание UI чтобы LLM сделал реальные кейсы
    ui_desc = {
        "title": "Калькулятор Cloud.ru — тест кейсы",
        "pages": ["home", "catalog", "calculator"],
        "elements": [
            {"name": "amount_input", "type": "number", "data-testid": "calc-amount"},
            {"name": "region_select", "type": "select", "data-testid": "calc-region"},
            {"name": "add_disk", "type": "button", "data-testid": "calc-add-disk"}
        ],
        "requirements": "15 manual UI cases: ID/Title/Preconditions/Steps/Expected. Locale: RU."
    }

    req = {
        "request_id": "req-ui-1",
        "mode": "manual_ui",
        "spec": ui_desc,
        "context": {"ui_notes": "см. case_detail.md, блоки калькулятора"},
        "callback_subject": callback
    }

    await nc.publish("ai.generate_tests", json.dumps(req).encode())

    await asyncio.wait_for(done.wait(), timeout=90)
    await nc.drain()

if __name__ == "__main__":
    asyncio.run(main())

