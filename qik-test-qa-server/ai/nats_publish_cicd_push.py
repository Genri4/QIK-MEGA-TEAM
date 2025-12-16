# ai/nats_publish_cicd_push.py
import asyncio, json, uuid
from pathlib import Path
from nats.aio.client import Client as NATS

async def main():
    nc = NATS()
    await nc.connect("nats://127.0.0.1:4222")

    callback = "ai.responses.local"

    async def cb(msg):
        try:
            data = json.loads(msg.data.decode())
        except Exception:
            print("RESPONSE (raw):", msg.data.decode())
            return
        print("CICD RESPONSE:", json.dumps(data, indent=2, ensure_ascii=False))

    await nc.subscribe(callback, cb=cb)

    # Укажи актуальный run_id или путь к артефакту
    run_id = "req-e2e-1"  # замените на свой run_id из generate
    artifact_path = Path(f"ai_artifacts/{run_id}/generated_{run_id}.py")
    content = artifact_path.read_text(encoding="utf-8")
    content += f"\n# AUTO-UPDATE {uuid.uuid4()}\n"

    req = {
        "request_id": "cicd-"+uuid.uuid4().hex[:8],
        "files": [{"path": f"tests/generated_{run_id}.py", "content": content}],
        "repo": "https://github.com/Hikerti/qik-test-qa-server",
        "branch": "test-ai-pusher_bot",
        "target_branch": "main",
        "commit_message": "Add AI generated tests",
        "create_pr": True,
        "dry_run": False,
        "callback_subject": callback
    }

    await nc.publish("ai.cicd.commit_push", json.dumps(req).encode())
    await asyncio.sleep(60)
    await nc.drain()

asyncio.run(main())
