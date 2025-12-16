# ai/nats_generate_test.py
import asyncio, json, uuid
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("127.0.0.1:4222")
    callback = "ai.responses.local_test"

    async def cb(msg):
        print("REPLY:", msg.data.decode())

    # подпишемся на callback (делать это ДО публикации — чтобы точно поймать ответ)
    await nc.subscribe(callback, cb=cb)

    payload = {
        "request_id": "req-" + uuid.uuid4().hex[:8],
        "spec": {
            "openapi": "3.0.0",
            "info": {"title": "demo", "version": "1.0.0"},
            "paths": {"/ping": {"get": {}}}
        },
        "callback_subject": callback
    }

    await nc.publish("ai.generate_tests", json.dumps(payload).encode())
    print("Published ai.generate_tests, waiting replies on", callback)
    await asyncio.sleep(8)   # подождать ответ от воркера
    await nc.drain()

if __name__ == "__main__":
    asyncio.run(main())
