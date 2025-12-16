# ai/nats_publish_generate_api.py
import asyncio, json
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://nats:4222")

    callback = "ai.responses.api"
    done = asyncio.Event()

    async def cb(msg):
        data = json.loads(msg.data.decode())
        print("API RESPONSE:", json.dumps(data, ensure_ascii=False))
        if data.get("status") in ("finished", "failed"):
            done.set()

    await nc.subscribe(callback, cb=cb)

    # Пример минимального OpenAPI для VMs/Disks/Flavors
    openapi = {
      "openapi": "3.0.0",
      "info": {"title": "compute", "version": "1.0.0"},
      "paths": {
        "/v1/vms": {"get": {}, "post": {}},
        "/v1/vms/{id}": {"get": {}, "delete": {}},
        "/v1/flavors": {"get": {}},
      }
    }

    req = {
        "request_id": "req-api-1",
        "mode": "manual_api",
        "spec": openapi,
        "context": {"api_notes": "VMs/Disks/Flavors, bearer auth, UUIDv4"},
        "callback_subject": callback
    }

    await nc.publish("ai.generate_tests", json.dumps(req).encode())
    await asyncio.wait_for(done.wait(), timeout=90)
    await nc.drain()

if __name__ == "__main__":
    asyncio.run(main())
