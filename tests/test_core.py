import os
import sys
# Add parent dir to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.utils.chunking import recursive_token_chunking
from backend.services.evaluation import EvaluationService

def test_chunking():
    text = "This is a long test document to verify that the recursive token chunking is working correctly. " * 50
    chunks = recursive_token_chunking(text, chunk_size=100, overlap=20)
    assert len(chunks) > 1
    print(f"Chunking test passed: Generated {len(chunks)} chunks.")

def test_evaluation():
    eval_service = EvaluationService()
    query = "Tesla revenue 2022"
    chunks = [{"text": "Tesla's revenue in 2022 was 81 billion dollars."}]
    result = eval_service.evaluate_retrieval(query, chunks)
    assert result["retrieval_score"] > 0
    print(f"Evaluation test passed: Score {result['retrieval_score']}%")

if __name__ == "__main__":
    test_chunking()
    test_evaluation()
