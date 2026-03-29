from backend.services.gemini_client import GeminiClient
from backend.config import REASONING_MODEL
from typing import List, Dict
import json

class InsightService:
    def __init__(self, model_name: str = REASONING_MODEL):
        self.client = GeminiClient()
        self.system_prompt = (
            "You are an Elite Document Intelligence Analyst. Analyze the document content and provide three distinct outputs in a single JSON block:\n"
            "1. INSIGHTS: Top 5 actionable insights.\n"
            "2. PROBES: 3 suggested questions about this document.\n"
            "3. TAGS: 2-3 technical keywords.\n\n"
            "Respond ONLY with a JSON object:\n"
            "{\"insights\": [], \"probes\": [], \"tags\": []}"
        )

    async def synthesize_intelligence(self, content: str) -> dict:
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Content:\n{content[:10000]}"}
        ]
        try:
            text = await self.client.invoke(messages)
            # Handle potential markdown wrapping
            if text.startswith("```json"):
                text = text[7:-3].strip()
            elif text.startswith("```"):
                text = text[3:-3].strip()
            return json.loads(text)
        except Exception as e:
            print(f"Synthesis failed: {e}")
            return {"insights": ["Intelligence indexed."], "probes": ["Explain the core content."], "tags": ["GENERAL"]}

    async def generate_insights(self, content: str) -> str:
        data = await self.synthesize_intelligence(content)
        return "\n".join(f"{i+1}. {x}" for i, x in enumerate(data.get("insights", [])))
