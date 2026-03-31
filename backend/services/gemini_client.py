from google import genai
from google.genai import errors as genai_errors
from backend.config import GEMINI_API_KEY, GEMINI_MODEL
import asyncio
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GeminiClient")

class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = GEMINI_MODEL

    def _generate_sync(self, prompt: str) -> str:
        """Synchronous generation using the new google-genai SDK with manual retry."""
        max_attempts = 8
        base_wait = 25
        for attempt in range(max_attempts):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )
                if response.text:
                    return response.text.strip()
                # Handle blocked/empty response
                logger.warning(f"Empty response from Gemini on attempt {attempt+1}")
                return ""
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
                    wait_time = base_wait * (2 ** attempt)
                    wait_time = min(wait_time, 120)
                    logger.warning(f"Rate limit hit. Waiting {wait_time}s before retry {attempt+1}/{max_attempts}...")
                    time.sleep(wait_time)
                    continue
                # Non-retriable error — raise immediately
                logger.error(f"Gemini generation error: {e}")
                raise
        raise RuntimeError(f"Gemini failed after {max_attempts} attempts due to rate limits.")

    async def invoke(self, messages: list, model_name: str = None) -> str:
        # Build a simple prompt from messages
        prompt = ""
        for msg in messages:
            role = "User" if msg["role"] in ("user", "system") else "Assistant"
            prompt += f"{role}: {msg['content']}\n"
        prompt += "\nAssistant:"

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._generate_sync, prompt)
