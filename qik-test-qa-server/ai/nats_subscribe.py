# ai/nats_subscribe.py
import asyncio
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://nats:4222")
    async def cb(msg):
        print("SUBJECT:", msg.subject)
        print(msg.data.decode())
    await nc.subscribe("ai.events.>", cb=cb)
    print("Subscribed to ai.events.>")
    await asyncio.sleep(300)   # слушать 300s
    await nc.drain()

asyncio.run(main())
