"""Загрузка Settings через libs.shared.config."""

from pydantic_settings import BaseSettings
from typing import List


class APISettings(BaseSettings):
    """API application settings."""
    
    # NATS configuration
    nats_servers: List[str] = ["nats://nats:4222"]
    nats_topic: str = "ai.generate.text"
    
    # API configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # Generator service path (for development)
    generator_path: str = ""
    
    class Config:
        env_prefix = "AI_API_"
        case_sensitive = False


# Global settings instance
settings = APISettings()
