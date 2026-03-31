from rank_bm25 import BM25Okapi
from typing import List, Dict
import numpy as np

class HybridSearchService:
    def __init__(self, vector_db):
        self.vector_db = vector_db

    def search(self, query: str, query_vector: List[float], all_documents: List[Dict], limit: int = 30):
        # 1. Vector Search
        vector_results = self.vector_db.search(query_vector, limit=limit)
        
        vector_map = {}
        for i, res in enumerate(vector_results):
            # Reciprocal Rank Fusion Score: 1 / (rank + k)
            vector_map[res.payload["text"]] = {
                "text": res.payload["text"],
                "metadata": res.payload["metadata"],
                "rank_score": 1.0 / (i + 60),
                "type": "hybrid"
            }

        # 2. BM25 Search (Keyword focus)
        if all_documents:
            tokenized_corpus = [doc['text'].lower().split() for doc in all_documents]
            bm25 = BM25Okapi(tokenized_corpus)
            tokenized_query = query.lower().split()
            bm25_scores = bm25.get_scores(tokenized_query)
            
            top_bm25_indices = np.argsort(bm25_scores)[-limit:][::-1]
            for i, idx in enumerate(top_bm25_indices):
                text = all_documents[idx]["text"]
                bm25_rank_score = 1.0 / (i + 60)
                
                if text in vector_map:
                    vector_map[text]["rank_score"] += bm25_rank_score
                else:
                    vector_map[text] = {
                        "text": text,
                        "metadata": all_documents[idx]["metadata"],
                        "rank_score": bm25_rank_score,
                        "type": "hybrid"
                    }
        
        # Sort by fused rank score
        merged_results = list(vector_map.values())
        merged_results.sort(key=lambda x: x["rank_score"], reverse=True)
        
        return merged_results[:limit]
