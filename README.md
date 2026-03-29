# InsightForge: Multi-Agent RAG Intelligence System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Gemini 2.0 Flash](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-DD2727?style=for-the-badge&logo=qdrant&logoColor=white)

Version: 1.0.4
Status: Production Ready
Core: Gemini 2.0 Flash

InsightForge is a high-performance Multi-Agent Retrieval-Augmented Generation (RAG) orchestrator designed for enterprise-grade document intelligence. It utilizes a sophisticated pipeline of specialized AI agents to decompose complex queries, retrieve high-density information, and synthesize grounded insights with multi-stage reasoning.

## Architecture and Components

The system is built on a modular multi-agent architecture where specialized nodes collaborate to provide accurate and context-aware responses.

### 1. Agentic Pipeline
- **Query Rewriter Agent**: Analyzes user input and generates optimized search queries. It focuses on keyword expansion, synonym matching, and intent clarification to bridge the gap between user language and document indexing.
- **Query Planner Agent**: Responsible for complex query decomposition. It breaks down multifaceted questions into a logical chain of sub-queries, facilitating structured information retrieval across different document sections.
- **Ranking Agent**: Utilizes cross-encoders (specifically `bge-reranker-small`) to evaluate the relevance of retrieved document chunks against the original intent. This ensures that only the highest quality context is provided to the reasoning engine.
- **Reasoning and Response Agent**: The final synthesis layer. It integrates the re-ranked context to generate a comprehensive response. It is programmed for strict grounding, ensuring all claims are backed by retrieved sources with precise citation mapping.

### 2. Search and Retrieval Services
- **Hybrid Retrieval Service**: Implements a dual-path search strategy. 
    - **Dense Retrieval**: Uses vector similarity based on `bge-small-en-v1.5` embeddings.
    - **Sparse Retrieval**: Implements BM25 for precise keyword-level matching.
- **Consolidated Ranking**: Merges results from both paths to provide a unified relevance score.

### 3. Data Ingestion Infrastructure
- **Direct Stream Ingestion**: bBypasses traditional multipart parsing overhead by implementing a raw request body streamer. This allows for the upload of large files (PDF, CSV) without triggering browser-side or network-level timeouts.
- **Asynchronous Processing**: All ingestion tasks (parsing, chunking, embedding) are handled by background workers. The API returns a 202 Accepted status immediately upon file buffering.
- **Recursive Chunking**: Documents are split into 800-token segments with 200-token overlaps to maintain semantic continuity across boundaries.

## Technical Stack

- **Frontend**: Developed with Next.js 16 (using Turbopack) and Tailwind CSS. The interface utilizes Framer Motion for high-fidelity animations and Lucide React for consistent iconography.
- **Backend**: Built on FastAPI 0.100+ with AnyIO for asynchronous execution and aiofiles for non-blocking file I/O operations.
- **AI Core**: Fully integrated with the Google Gemini API, specifically leveraging the Gemini 2.0 Flash model for its large context window (1.5M tokens) and low latency.
- **Vector Database**: Utilizes Qdrant for high-performance vector storage and retrieval. The system includes an automated in-memory fallback for environments where a dedicated Qdrant instance is unavailable.

## Intelligence Visualization

### Neural Topology Graph
The application includes a dynamic knowledge topology visualizer that maps the relationships between document nodes, generated insights, and suggested research probes. This graph provides a visual representation of the system's internal session intelligence.

### Analytics Dashboard
Real-time monitoring of RAG performance metrics, including:
- Vector similarity distribution.
- Source density analysis.
- Detailed token cost tracking per query.

## Directory Structure

- `/backend`: FastAPI source code, agent definitions, and ingestion services.
- `/frontend`: Next.js application, React components, and UI state management.
- `/pipelines`: Core RAG orchestration logic.
- `/services`: Abstractions for embeddings, vector DB, and external AI clients.
- `/tests`: Automated system verification and unit tests.

## Installation and Configuration

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- Access to Google Gemini API

### Backend Setup
1. Initialize a Python virtual environment.
2. Install dependencies: `pip install -r requirements.txt`.
3. Configure the `.env` file with your `GEMINI_API_KEY`.

### Frontend Setup
1. Navigate to the frontend directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

### Execution
The backend should be launched using uvicorn:
`python -m uvicorn backend.main:app --port 8002 --reload`

## License
InsightForge is distributed under the MIT License.
