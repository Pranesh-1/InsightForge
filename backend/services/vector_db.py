from qdrant_client import QdrantClient
from qdrant_client.http import models
from backend.config import QDRANT_URL
from typing import List, Dict
import uuid

class VectorDBService:
    def __init__(self, collection_name: str = "insightforge"):
        # Use in-memory Qdrant for local development/showcase
        self.client = QdrantClient(location=":memory:")
        self.collection_name = collection_name
        self._ensure_collection()

    def _ensure_collection(self):
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        if not exists:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
            )

    def upsert_documents(self, documents: List[Dict], embeddings: List[List[float]]):
        points = []
        for i, doc in enumerate(documents):
            points.append(models.PointStruct(
                id=str(uuid.uuid4()),
                vector=embeddings[i],
                payload={
                    "text": doc["text"],
                    "metadata": doc["metadata"]
                }
            ))
        self.client.upsert(collection_name=self.collection_name, points=points)

    def search(self, query_vector: List[float], limit: int = 20):
        # Using query_points for newer qdrant-client versions
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit
        )
        return results.points if hasattr(results, 'points') else results
