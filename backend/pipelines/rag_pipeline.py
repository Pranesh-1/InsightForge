from typing import List, Dict, Any, Optional
from backend.services.evaluation import EvaluationService
from backend.agents.rewrite_agent import RewriteAgent
from backend.agents.planner_agent import PlannerAgent
from backend.agents.ranking_agent import RankingAgent
from backend.agents.reasoning_agent import ReasoningAgent
from backend.services.embeddings import EmbeddingService
from backend.services.vector_db import VectorDBService
from backend.services.hybrid_search import HybridSearchService
from backend.services.cost_tracker import CostTrackerService
from backend.config import RETRIEVAL_TOP_K

class RAGPipeline:
    def __init__(self):
        self.rewrite_agent = RewriteAgent()
        self.planner_agent = PlannerAgent()
        self.embedding_service = EmbeddingService()
        self.vector_db = VectorDBService()
        self.hybrid_search = HybridSearchService(self.vector_db)
        self.ranking_agent = RankingAgent()
        self.reasoning_agent = ReasoningAgent()
        self.cost_tracker = CostTrackerService()
        self.evaluation_service = EvaluationService()

    async def run(self, query: str, all_docs: List[Dict]):
        try:
            # 1. Unified Analysis (Rewrite + Plan)
            analysis = await self.rewrite_agent.analyze_query(query)
            rewritten_query = analysis.get("rewritten_query", query)
            sub_queries = analysis.get("sub_queries", [query])
            
            all_retrieved_chunks = []
            for sub_q in sub_queries:
                # 3. Embed & Search
                q_vector = self.embedding_service.generate_query_embedding(sub_q)
                # Fetch more chunks per sub-query for high-capacity reasoning
                chunks = self.hybrid_search.search(sub_q, q_vector, all_docs)
                all_retrieved_chunks.extend(chunks)
                
            # 4. De-duplicate & Rerank
            unique_chunks = {chunk["text"]: chunk for chunk in all_retrieved_chunks}.values()
            # Increase rerank limit to utilize Gemini context
            top_chunks = await self.ranking_agent.rerank(rewritten_query, list(unique_chunks))
            top_chunks = top_chunks[:RETRIEVAL_TOP_K]
            
            # 5. Reason & Synthesize
            final_answer = await self.reasoning_agent.reason(rewritten_query, top_chunks)
            
            # 6. Evaluate
            eval_result = await self.evaluation_service.evaluate_retrieval(rewritten_query, top_chunks)
            
            # 7. Cost Tracking (Simplified estimation)
            input_tokens = len(query.split()) + sum(len(q.split()) for q in sub_queries) + 500 # Plus context
            output_tokens = len(final_answer.split())
            cost_info = self.cost_tracker.track_usage(input_tokens, output_tokens)
            
            return {
                "query": query,
                "rewritten_query": rewritten_query,
                "sub_queries": sub_queries,
                "answer": final_answer,
                "source_chunks": top_chunks,
                "evaluation": eval_result,
                "cost": cost_info
            }
        except Exception as e:
            print(f"CRITICAL ERROR in RAGPipeline: {e}")
            return {
                "query": query,
                "answer": f"Neural Congestion detected: {str(e)[:100]}. Your query has been stalled due to high API pressure. Please wait 30 seconds and try again.",
                "source_chunks": [],
                "sub_queries": [query],
                "cost": {"total_cost": 0, "total_tokens": 0},
                "error": str(e)
            }
