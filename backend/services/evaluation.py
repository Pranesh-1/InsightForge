from typing import List, Dict

class EvaluationService:
    def __init__(self):
        pass

    async def evaluate_retrieval(self, query: str, retrieved_chunks: List[Dict]) -> Dict:
        """
        Simple evaluation metric: check if the query tokens are present in the chunks.
        In production, this would use an LLM or cross-encoder.
        """
        query_tokens = set(query.lower().split())
        coverage = []
        for chunk in retrieved_chunks:
            chunk_tokens = set(chunk["text"].lower().split())
            overlap = query_tokens.intersection(chunk_tokens)
            coverage.append(len(overlap) / len(query_tokens) if query_tokens else 0)
            
        avg_coverage = sum(coverage) / len(coverage) if coverage else 0
        return {
            "retrieval_score": round(avg_coverage * 100, 2),
            "hallucination_risk": "low" if avg_coverage > 0.5 else "high"
        }

    async def hallucination_check(self, answer: str, context: List[Dict]) -> bool:
        """
        Very basic check: Is the answer content present in context?
        """
        # Placeholder for complex LLM-based fact checking
        return "I could not find" not in answer
