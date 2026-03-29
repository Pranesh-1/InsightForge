from backend.services.gemini_client import GeminiClient
from backend.config import PLANNER_MODEL
from typing import List
import json

class PlannerAgent:
    def __init__(self, model_name: str = PLANNER_MODEL):
        self.model_name = model_name
        self.client = GeminiClient()

    async def plan(self, query: str) -> List[str]:
        messages = [
            {"role": "system", "content": "You are a Query Planner Agent. Your task is to analyze a user query and decide if it needs to be decomposed into multiple sub-questions for better retrieval from different document sections or sources."},
            {"role": "user", "content": f"Query: {query}\n\nRespond with a JSON list of search-optimized sub-queries. If the query is simple, just return it in a list of one item.\nExample: 'Compare Tesla and Apple revenue' -> [\"Tesla revenue growth\", \"Apple revenue growth\"]\nFormat: [\"query1\", \"query2\"]"}
        ]
        
        try:
            content = (await self.client.invoke(messages, self.model_name)).strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            return json.loads(content)
        except Exception as e:
            print(f"Planning error: {e}")
            return [query]
