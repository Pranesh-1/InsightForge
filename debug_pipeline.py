
import asyncio
from backend.pipelines.rag_pipeline import RAGPipeline

async def test():
    from backend.config import GROQ_API_KEY
    print(f"GROQ_API_KEY length: {len(GROQ_API_KEY) if GROQ_API_KEY else 'N/A'}")
    print(f"GROQ_API_KEY starts with: {GROQ_API_KEY[:10] if GROQ_API_KEY else 'N/A'}")
    try:
        pipeline = RAGPipeline()
        print("Pipeline initialized")
        result = await pipeline.run("Test query", [])
        print("Result:", result)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
