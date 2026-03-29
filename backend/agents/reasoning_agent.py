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
            {"role": "system", "content": "You are a Document Reasoning Assistant. Use the provided context to answer the user's question accurately. Provide inline citations in the format [source_name, page_number]. If the answer is not in the context, say 'I could not find information in the provided documents.'"},
            {"role": "user", "content": f"Context:\n{formatted_context}\n\nQuestion: {query}"}
        ]
        
        return (await self.client.invoke(messages, self.model_name)).strip()
