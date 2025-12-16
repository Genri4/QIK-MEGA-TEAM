# AI API Service

FastAPI service for handling NATS requests from gate microservice.

## Structure

- `src/ai_api/main.py` - FastAPI app with NATS integration
- `src/ai_api/config.py` - Configuration settings
- `src/ai_api/controllers/nats_controller.py` - NATS message handler

## NATS Integration

The service listens to NATS topic `ai.generate.text` (configurable via `AI_API_NATS_TOPIC`).

### Request Format

```json
{
  "prompt": "Generate test cases for authentication",
  "context": {
    "endpoint": "/api/v1/auth/login",
    "db_data_needed": true,
    "user_id": 123
  },
  "options": {
    "temperature": 0.7
  }
}
```

### Response Format

```json
{
  "result": "Generated test cases...",
  "status": "completed",
  "agent_source": "AI Generator Service",
  "metadata": {
    "prompt_length": 45,
    "has_context": true
  }
}
```

## Configuration

Environment variables:
- `AI_API_NATS_SERVERS` - NATS servers (comma-separated, default: "nats://localhost:4222")
- `AI_API_NATS_TOPIC` - NATS topic (default: "ai.generate.text")
- `AI_API_API_HOST` - API host (default: "0.0.0.0")
- `AI_API_API_PORT` - API port (default: 8000)

## Running

```bash
cd apps/api
pip install -r requirements.txt
python -m ai_api.main
```

Or with uvicorn:
```bash
uvicorn ai_api.main:app --host 0.0.0.0 --port 8000
```

## Integration with Gate

Gate service sends requests via NATS to topic `ai.generate.text`. The controller:
1. Receives request from NATS
2. Validates request format
3. Optionally requests user data from gate if `db_data_needed` is true
4. Calls generator service
5. Sends response back via NATS reply subject

