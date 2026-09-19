from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # AI Provider
    ai_provider: str = "openai"

    # OpenAI
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4"
    openai_base_url: str = "https://api.openai.com/v1"

    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"

    # Database - Support both SQLite and PostgreSQL
    database_url: Optional[str] = None

    @property
    def get_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        # Default to SQLite for local development
        return "sqlite:///./database/assistant.db"

    # App
    app_name: str = "AI Personal Assistant"
    app_version: str = "1.0.0"
    debug: bool = True
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    # Voice
    voice_enabled: bool = True
    tts_engine: str = "gtts"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
