# InsightForge: Multi-Agent RAG Intelligence System

![InsightForge Logo](https://img.shields.io/badge/InsightForge-v1.0.4-gold?style=for-the-badge&logo=appveyor)
![Framework](https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js)
![Backend](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![AI Core](https://img.shields.io/badge/Gemini%201.5%20Flash-4285F4?style=for-the-badge&logo=google-gemini)

**InsightForge** is a high-performance Multi-Agent RAG (Retrieval-Augmented Generation) orchestrator designed for enterprise-grade document intelligence. It utilizes a sophisticated pipeline of AI agents to decompose complex queries, retrieve high-density information, and synthesize grounded insights with multi-stage reasoning.

---

## 🛰️ Architecture Overview

InsightForge is built on a **Modular Multi-Agent Architecture** where specialized agents collaborate to provide the most accurate and context-aware responses:

1.  **Query Rewriter Agent**: Optimizes user input for better retrieval by expanding keywords and refining intent.
2.  **Query Planner Agent**: Decomposes complex multi-faceted questions into a chain of sub-queries.
3.  **Hybrid Retrieval Service**: Combines **Vector Similarity (Dense)** and **BM25 (Sparse)** searches for maximum precision.
4.  **Ranking Agent**: Re-ranks retrieved chunks using cross-encoders (`bge-reranker-small`) to ensure relevance.
5.  **Reasoning & Response Agent**: Synthesizes the final answer, ensuring all claims are grounded in the retrieved sources with precise citation mapping.

---

## 💎 Key Features

- **🚀 Obsidian Amber UI**: A premium, "hyper-glass" dashboard designed for visual excellence and high interaction.
- **⚡ Async Streaming Ingestion**: Handle massive document uploads (PDF, CSV, Web) without browser timeouts via chunked background workers.
- **🧠 Neural Topology Graph**: Visualize the relationships between documents and insights in a dynamic, 3D-effect knowledge graph.
- **🛡️ Secure Neural Core**: Fully integrated with **Gemini 1.5 Flash**, offering a 1.5M token context window for deep document analysis.
- **📊 Intelligence Dashboard**: Real-time analytics on retrieval similarity, source density, and query performance.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (Turbopack), Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI, AnyIO, aiofiles.
- **AI/LLM**: Google Gemini 1.5 Flash, BAAI/bge-small-en embeddings.
- **Vector Database**: Qdrant (with In-memory fallback).
- **Processing**: PyPDF, PyMuPDF, Scrapy (Web Crawling).

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key

### 2. Installation

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_key_here
QDRANT_URL=localhost:6333
```

### 4. Running the Application
```bash
# Terminal 1: Backend
python -m uvicorn backend.main:app --port 8002 --reload

# Terminal 2: Frontend
npm run dev
```

---

## 🧪 System Verification
Execute the core test suite to ensure neural handshake stability:
```bash
python -m pytest tests/test_core.py
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ at InsightForge AI Labs.*
