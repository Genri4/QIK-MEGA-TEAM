# ai/nats_publish_generate.py
import asyncio, json
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://nats:4222")
    req = {
      "request_id":"test-gen-1",
      "spec":{"openapi":"3.0.0","info":{"title":"demo","version":"1.0.0"},"paths":{"/ping":{"get":{}}}},
      "callback_subject":"ai.responses.testgen1"
    }
    await nc.publish("ai.generate_tests", json.dumps(req).encode())
    async def cb(msg): print("RESPONSE:", msg.data.decode())
    await nc.subscribe("ai.responses.testgen1", cb=cb)
    await asyncio.sleep(10)
    await nc.drain()

asyncio.run(main())
