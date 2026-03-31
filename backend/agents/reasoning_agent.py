from backend.services.gemini_client import GeminiClient
from backend.config import REASONING_MODEL
from typing import List, Dict

class ReasoningAgent:
    def __init__(self, model_name: str = REASONING_MODEL):
        self.model_name = model_name
        self.client = GeminiClient()

    async def reason(self, query: str, context_chunks: List[Dict]) -> str:
        formatted_context = ""
        for i, chunk in enumerate(context_chunks):
            formatted_context += f"[{i+1}] {chunk['text']}\nMetadata: {chunk['metadata']}\n\n"
            
        messages = [
            {"role": "system", "content": "You are a Senior Technical Reasoning Assistant. Use the provided context to answer the user's query with extreme precision. Use inline citations [source, page].\nSTYLE: Provide a CONCISE, NEAT, and bulleted executive summary first, then brief supporting details. Avoid dense paragraphs. If the answer is not in the context, state it clearly."},
            {"role": "user", "content": f"Context:\n{formatted_context}\n\nQuestion: {query}"}
        ]
        
        return (await self.client.invoke(messages, self.model_name)).strip()
