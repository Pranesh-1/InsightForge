from sentence_transformers import CrossEncoder
from backend.config import RERANKER_MODEL
from typing import List, Dict

class RankingAgent:
    def __init__(self, model_name: str = RERANKER_MODEL):
        self.model_name = model_name
        self._model = None

    @property
    def model(self):
        if self._model is None:
            try:
                print(f"Loading ranking model: {self.model_name}")
                self._model = CrossEncoder(self.model_name)
            except Exception as e:
                print(f"Warning: Failed to load ranking model {self.model_name}. Using fallback scoring. Error: {e}")
                self._model = "fallback"
        return self._model

    async def rerank(self, query: str, candidates: List[Dict], top_k: int = 25) -> List[Dict]:
        if not candidates:
            return []
            
        if self.model == "fallback":
            # Just return original candidates if model failed to load
            return candidates[:top_k]

        pairs = [[query, cand["text"]] for cand in candidates]
        scores = self.model.predict(pairs)
        
        for i, cand in enumerate(candidates):
            cand["rerank_score"] = float(scores[i])
            
        sorted_candidates = sorted(candidates, key=lambda x: x["rerank_score"], reverse=True)
        return sorted_candidates[:top_k]
