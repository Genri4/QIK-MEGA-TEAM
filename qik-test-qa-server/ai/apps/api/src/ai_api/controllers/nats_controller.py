"""NATS controller for handling requests from gate microservice."""

import json
import logging
from typing import Dict, Any
from nats.aio.client import Client as NATS

# Import generator service
import sys
from pathlib import Path

# Add generator to path (in production use proper package installation)
generator_path = Path(__file__).parent.parent.parent.parent.parent / "generator" / "src"
sys.path.insert(0, str(generator_path))

from ai_generator.service import GeneratorService
from ai_generator.models import GenerationRequest, GenerationResponse, ErrorResponse

logger = logging.getLogger(__name__)


class NATSController:
    """
    NATS controller for handling microservice requests from gate.
    
    Listens to NATS topics and processes generation requests.
    """
    
    def __init__(self, nats_client: NATS, generator_service: GeneratorService):
        """
        Initialize NATS controller.
        
        Args:
            nats_client: NATS client instance
            generator_service: Generator service instance
        """
        self.nc = nats_client
        self.generator_service = generator_service
        self._subscribed = False
    
    async def subscribe(self, topic: str = "ai.generate.text"):
        """
        Subscribe to NATS topic for generation requests.
        
        Args:
            topic: NATS topic to listen to (default: "ai.generate.text")
        """
        if self._subscribed:
            logger.warning(f"Already subscribed to topic: {topic}")
            return
        
        await self.nc.subscribe(topic, cb=self._handle_generation_request)
        self._subscribed = True
        logger.info(f"NATS controller subscribed to topic: {topic}")
    
    async def _handle_generation_request(self, msg):
        """
        Handle incoming NATS message with generation request.
        
        Args:
            msg: NATS message object with reply subject
        """
        reply = msg.reply
        
        try:
            # Parse request data
            data = json.loads(msg.data.decode())
            logger.info(f"Received generation request: {data.get('prompt', '')[:50]}...")
            
            # Validate and create request model
            try:
                request = GenerationRequest(**data)
            except Exception as e:
                error_response = ErrorResponse(
                    error="Invalid request format",
                    details={"validation_error": str(e)}
                )
                await self.nc.publish(reply, json.dumps(error_response.model_dump()).encode())
                return
            
            # Check if context needs user data (like in nats_sample.py example)
            if request.context and request.context.get("db_data_needed"):
                # Request user data from gate if needed
                user_data = await self._request_user_data(user_id=request.context.get("user_id", 123))
                request.context["user_data"] = user_data
            
            # Generate using service
            response = await self.generator_service.generate_from_request(request)
            
            # Send response back
            await self.nc.publish(reply, json.dumps(response.model_dump()).encode())
            logger.info(f"Generation completed, response sent to {reply}")
            
        except json.JSONDecodeError:
            error_response = ErrorResponse(error="Invalid JSON format")
            await self.nc.publish(reply, json.dumps(error_response.model_dump()).encode())
            logger.error("Failed to parse JSON from NATS message")
            
        except Exception as e:
            error_response = ErrorResponse(
                error="Generation failed",
                details={"error": str(e)}
            )
            await self.nc.publish(reply, json.dumps(error_response.model_dump()).encode())
            logger.exception(f"Error processing generation request: {e}")
    
    async def _request_user_data(self, user_id: int) -> Dict[str, Any]:
        """
        Request user data from gate service via NATS.
        
        Similar to nats_sample.py example - requests data from gate.
        
        Args:
            user_id: User ID to request
            
        Returns:
            User data dictionary
        """
        try:
            msg = await self.nc.request(
                "data.users.get_by_id",
                json.dumps({"userId": user_id}).encode(),
                timeout=5.0
            )
            user_data = json.loads(msg.data.decode())
            logger.debug(f"Received user data for user {user_id}: {user_data}")
            return user_data
        except Exception as e:
            logger.warning(f"Failed to request user data: {e}")
            return {"error": str(e)}

