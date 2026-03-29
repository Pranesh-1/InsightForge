import os
from backend.services.embeddings import EmbeddingService
print("Initializing EmbeddingService...")
try:
    e = EmbeddingService()
    print("EmbeddingService initialized.")
except Exception as ex:
    print(f"Failed to initialize EmbeddingService: {ex}")

from backend.agents.ranking_agent import RankingAgent
print("Initializing RankingAgent...")
try:
    r = RankingAgent()
    print("RankingAgent initialized.")
except Exception as ex:
    print(f"Failed to initialize RankingAgent: {ex}")
