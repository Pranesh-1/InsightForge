from backend.services.gemini_client import GeminiClient
from backend.config import REWRITE_MODEL
import json

class RewriteAgent:
    def __init__(self, model_name: str = REWRITE_MODEL):
        self.model_name = model_name
        self.client = GeminiClient()

    async def analyze_query(self, query: str) -> dict:
        messages = [
            {"role": "system", "content": "You are an Elite Query Analyst. Your task is to perform two critical steps in one inference:\n1. REWRITE: Optimize the messy user query for vector search.\n2. PLAN: Decompose the query into a JSON list of detailed sub-queries for hybrid retrieval.\n\nRespond ONLY with a JSON object in this format:\n{\n  \"rewritten_query\": \"optimized version\",\n  \"sub_queries\": [\"sub-q1\", \"sub-q2\"]\n}"},
            {"role": "user", "content": f"Query: {query}"}
        ]
        try:
            content = (await self.client.invoke(messages, self.model_name)).strip()
            # Handle potential markdown wrapping
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            return json.loads(content)
        except Exception as e:
            print(f"Unified analysis failed, falling back to basic: {e}")
            return {"rewritten_query": query, "sub_queries": [query]}
