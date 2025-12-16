# ai/nats_publish_generate_api_tests.py
import asyncio, json
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://nats:4222")

    callback = "ai.responses.apit"
    done = asyncio.Event()

    async def cb(msg):
        data = json.loads(msg.data.decode())
        print("API TESTS RESPONSE:", json.dumps(data, ensure_ascii=False))
        if data.get("status") in ("finished", "failed"):
            done.set()

    await nc.subscribe(callback, cb=cb)

    req = {
        "request_id": "req-apit-1",
        "mode": "api_tests",
        "spec": {"openapi": "3.0.0", "info": {"title": "compute", "version": "1.0.0"}, "paths": {}},
        "context": {"api_notes": "VMs/Disks/Flavors, позитив/негатив, bearer"},
        "callback_subject": callback
    }

    await nc.publish("ai.generate_tests", json.dumps(req).encode())
    await asyncio.wait_for(done.wait(), timeout=90)
    await nc.drain()

if __name__ == "__main__":
    asyncio.run(main())
