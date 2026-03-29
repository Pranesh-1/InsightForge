import pandas as pd
import os
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from backend.utils.chunking import recursive_token_chunking
from typing import List, Dict

class IngestionService:
    def __init__(self):
        pass

    def load_pdf(self, file_path: str) -> List[Dict]:
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        documents = []
        for i, page in enumerate(pages):
            chunks = recursive_token_chunking(page.page_content)
            for chunk in chunks:
                documents.append({
                    "text": chunk,
                    "metadata": {
                        "source": file_path,
                        "document_name": os.path.basename(file_path),
                        "page": i + 1,
                        "type": "pdf"
                    }
                })
        return documents

    def load_csv(self, file_path: str) -> List[Dict]:
        df = pd.read_csv(file_path)
        text_data = df.to_string()
        chunks = recursive_token_chunking(text_data)
        documents = []
        for chunk in chunks:
            documents.append({
                "text": chunk,
                "metadata": {
                    "source": file_path,
                    "document_name": os.path.basename(file_path),
                    "type": "csv"
                }
            })
        return documents

    def load_web(self, url: str) -> List[Dict]:
        loader = WebBaseLoader(url)
        data = loader.load()
        documents = []
        for page in data:
            chunks = recursive_token_chunking(page.page_content)
            for chunk in chunks:
                documents.append({
                    "text": chunk,
                    "metadata": {
                        "source": url,
                        "document_name": url.split("//")[-1].split("/")[0],
                        "type": "web"
                    }
                })
        return documents
