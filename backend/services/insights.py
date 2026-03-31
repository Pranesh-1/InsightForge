from backend.services.gemini_client import GeminiClient
from backend.config import REASONING_MODEL
from typing import List, Dict
import json

class InsightService:
    def __init__(self, model_name: str = REASONING_MODEL):
        self.client = GeminiClient()
    async def synthesize_intelligence(self, content: str, filename: str = "Synthesis") -> dict:
        prompt = (
            "You are an Elite Document Intelligence Analyst. Analyze the document context and provide three distinct outputs in a single JSON block:\n"
            "1. INSIGHTS: Top 5 distinct, high-impact actionable observations in Markdown bullet format (•).\n"
            "2. PROBES: 3 simple, concise, one-line questions this document can answer. Each probe must have 'text' and 'source' fields.\n"
            "3. TAGS: 2-3 technical domain keywords.\n\n"
            f"If the content is primarily from '{filename}', attribute probes to it. If it spans multiple contexts, label as 'Synthesis'.\n"
            "Respond ONLY with a valid JSON object. No conversational text.\n"
            "Format: {\"insights\": [\"• insight 1\", \"• insight 2\"...], \"probes\": [{\"text\": \"Simple Question?\", \"source\": \"...\"}], \"tags\": [...]}"
        )
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"CONTENT STREAM FOR ANALYSIS ({filename}):\n\n{content[:15000]}"}
        ]
        try:
            text = await self.client.invoke(messages)
            # Handle potential markdown wrapping
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            return json.loads(text.strip())
        except Exception as e:
            print(f"CRITICAL: Synthesis failed after retries: {e}")
            raise  # Strictly bubble-up the error so background task status correctly shows 'error' on 429s instead of fake success.

    async def generate_insights(self, content: str) -> str:
        data = await self.synthesize_intelligence(content)
        return "\n".join(f"{i+1}. {x}" for i, x in enumerate(data.get("insights", [])))
