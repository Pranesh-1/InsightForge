import google.generativeai as genai
from backend.config import GEMINI_API_KEY, GEMINI_MODEL
import asyncio

class GeminiClient:
    def __init__(self):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(GEMINI_MODEL)

    async def invoke(self, messages: list, model_name: str = None) -> str:
        # Convert messages to Gemini format
        # System message is handled in model initialization or as a separate role if needed
        # For simplicity, we'll combine them
        prompt = ""
        for msg in messages:
            role = "User" if msg["role"] == "user" or msg["role"] == "system" else "Assistant"
            prompt += f"{role}: {msg['content']}\n"
        
        prompt += "\nAssistant:"
        
        # Run in thread to avoid blocking (google-generativeai isn't fully async yet)
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, self.model.generate_content, prompt)
        return response.text.strip()
