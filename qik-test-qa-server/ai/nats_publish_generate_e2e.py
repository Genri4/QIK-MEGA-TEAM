# ai/nats_publish_generate_e2e.py
import asyncio, json
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://nats:4222")

    callback = "ai.responses.e2e"
    done = asyncio.Event()

    async def cb(msg):
        data = json.loads(msg.data.decode())
        print("E2E RESPONSE:", json.dumps(data, ensure_ascii=False))
        if data.get("status") in ("finished", "failed"):
            done.set()

    await nc.subscribe(callback, cb=cb)

    req = {
        "request_id": "req-e2e-1",
        "mode": "e2e",
        "spec": {"openapi": "3.0.0", "info": {"title": "demo", "version": "1.0.0"}, "paths": {}},
        "context": {"ui_notes": "главная, каталог, конфигурация compute, mobile"},
        "callback_subject": callback
    }

    await nc.publish("ai.generate_tests", json.dumps(req).encode())
    await asyncio.wait_for(done.wait(), timeout=90)
    await nc.drain()

if __name__ == "__main__":
    asyncio.run(main())
