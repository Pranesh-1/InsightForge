import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip() or None
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip() or None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip() or None
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# RAG Settings
CHUNK_SIZE = 1500
CHUNK_OVERLAP = 300
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
RERANKER_MODEL = "BAAI/bge-reranker-small" 
RETRIEVAL_TOP_K = 25  # High-volume retrieval enabled

# Agent Configurations (Full Gemini Core)
PLANNER_MODEL = "models/gemini-2.0-flash"
REASONING_MODEL = "models/gemini-2.0-flash"
REWRITE_MODEL = "models/gemini-2.0-flash" 
SYNTHESIS_MODEL = "models/gemini-2.0-flash"
GEMINI_MODEL = "models/gemini-2.0-flash"
