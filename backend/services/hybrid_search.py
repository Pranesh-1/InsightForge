from rank_bm25 import BM25Okapi
from typing import List, Dict
import numpy as np

class HybridSearchService:
    def __init__(self, vector_db):
        self.vector_db = vector_db

    def search(self, query: str, query_vector: List[float], all_documents: List[Dict], limit: int = 20):
        # 1. Vector Search
        vector_results = self.vector_db.search(query_vector, limit=limit)
        
        merged_results = []
        for res in vector_results:
            merged_results.append({
                "text": res.payload["text"],
                "metadata": res.payload["metadata"],
                "score": res.score,
                "type": "vector"
            })

        # 2. BM25 Search (Only if documents exist)
        if all_documents:
            tokenized_corpus = [doc['text'].split(" ") for doc in all_documents]
            bm25 = BM25Okapi(tokenized_corpus)
            tokenized_query = query.split(" ")
            bm25_scores = bm25.get_scores(tokenized_query)
            
            # Normalize BM25 scores
            if len(bm25_scores) > 0 and (np.max(bm25_scores) - np.min(bm25_scores)) > 0:
                bm25_scores = (bm25_scores - np.min(bm25_scores)) / (np.max(bm25_scores) - np.min(bm25_scores) + 1e-9)
            
            # Top BM25 results
            top_bm25_indices = np.argsort(bm25_scores)[-limit:][::-1]
            for idx in top_bm25_indices:
                merged_results.append({
                    "text": all_documents[idx]["text"],
                    "metadata": all_documents[idx]["metadata"],
                    "score": bm25_scores[idx],
                    "type": "bm25"
                })
        
        return merged_results
            
        # Top BM25 results
        top_bm25_indices = np.argsort(bm25_scores)[-limit:][::-1]
        for idx in top_bm25_indices:
            merged_results.append({
                "text": all_documents[idx]["text"],
                "metadata": all_documents[idx]["metadata"],
                "score": bm25_scores[idx],
                "type": "bm25"
            })
            
        return merged_results
