# AI Generator Service

Core service for prompt-based text generation.

## Structure

- `src/ai_generator/models.py` - Pydantic models for requests/responses
- `src/ai_generator/service.py` - Core generator service with flat methods

## Models

### GenerationRequest
Request model for text generation:
- `prompt` (str, required) - Text prompt for generation
- `context` (dict, optional) - Additional context data
- `options` (dict, optional) - Generation options

### GenerationResponse
Response model with generated result:
- `result` (str) - Generated text
- `status` (GenerationStatus) - Status enum
- `agent_source` (str) - Source identifier
- `metadata` (dict, optional) - Additional metadata

## Service Methods

### `generate_by_prompt(prompt, context=None, options=None)`
Generate text based on prompt with optional context and options.

### `generate_from_request(request: GenerationRequest)`
Generate from full request model.

### `generate_with_context(prompt, user_data=None, additional_context=None)`
Convenient method for integration scenarios with user data.

## Usage

```python
from ai_generator import GeneratorService, GenerationRequest

service = GeneratorService()

# Simple generation
response = await service.generate_by_prompt("Generate test cases")

# With context
response = await service.generate_with_context(
    prompt="Analyze user data",
    user_data={"id": 1, "name": "John"}
)
```

