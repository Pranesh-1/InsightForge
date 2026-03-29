from sentence_transformers import SentenceTransformer
from backend.config import EMBEDDING_MODEL
import torch

class EmbeddingService:
    def __init__(self, model_name: str = EMBEDDING_MODEL):
        self.model_name = model_name
        self._model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    @property
    def model(self):
        if self._model is None:
            print(f"Loading embedding model: {self.model_name} on {self.device}")
            self._model = SentenceTransformer(self.model_name, device=self.device)
        return self._model

    def generate_embeddings(self, text_chunks: list[str]):
        return self.model.encode(text_chunks, normalize_embeddings=True).tolist()

    def generate_query_embedding(self, query: str):
        return self.model.encode([query], normalize_embeddings=True).tolist()[0]
