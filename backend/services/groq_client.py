import os
import httpx
import asyncio
from backend.config import GROQ_API_KEY

class GroqClient:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    async def invoke(self, messages: list, model: str) -> str:
        if not self.api_key:
            return "Error: GROQ_API_KEY is missing."
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": model,
            "messages": messages,
            "temperature": 0.1
        }
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(self.url, headers=headers, json=data)
                    
                    if response.status_code == 200:
                        return response.json()["choices"][0]["message"]["content"]
                    
                    if response.status_code == 429:
                        print(f"DEBUG: Groq Rate Limit (429) - Attempt {attempt + 1}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(2 ** (attempt + 1)) # Non-blocking sleep
                            continue
                    
                    print(f"Groq Error Output ({response.status_code}): {response.text}")
                    return f"Neural Congestion (Status {response.status_code}). Please retry in 30 seconds."
            except Exception as e:
                print(f"HTTPX Error in GroqClient: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(1)
                    continue
                return "Neural Synapse Timeout. The connection to the LLM core was lost."
        
        return "Critical Rate Limit. Please wait 60 seconds."
