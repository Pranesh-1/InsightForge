
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GROQ_API_KEY")
print(f"API Key present: {bool(api_key)}")
print(f"API Key starts with: {api_key[:10]}...")

try:
    llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=api_key)
    print("Invoking Groq...")
    res = llm.invoke("Say hi")
    print("Response:", res.content)
except Exception as e:
    import traceback
    traceback.print_exc()
