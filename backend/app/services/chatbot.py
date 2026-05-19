import httpx
from app.core.config import settings
from app.core.logger import logger

async def ask_chatbot(question: str) -> str:
    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful AI news assistant. Answer clearly and concisely."
            },
            {
                "role": "user",
                "content": question
            }
        ],
        "stream": False
    }
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(settings.OLLAMA_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["message"]["content"]
    except httpx.ConnectError:
        logger.error("Ollama is not running")
        return "ERROR: Ollama is not running. Please run `ollama serve` in a terminal."
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return f"ERROR: {str(e)}"
