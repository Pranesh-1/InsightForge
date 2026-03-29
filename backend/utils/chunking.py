from typing import List
import tiktoken

def get_token_count(text: str, model: str = "gpt-3.5-turbo") -> int:
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

def recursive_token_chunking(text: str, chunk_size: int = 800, overlap: int = 200) -> List[str]:
    """
    Chunks text recursively based on tokens.
    """
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)
    
    chunks = []
    start = 0
    while start < len(tokens):
        end = start + chunk_size
        chunk_tokens = tokens[start:end]
        chunks.append(encoding.decode(chunk_tokens))
        
        if end >= len(tokens):
            break
        start += (chunk_size - overlap)
        
    return chunks
