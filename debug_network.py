
import os
import httpx
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GROQ_API_KEY")
print(f"API Key present: {bool(api_key)}")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "hi"}]
}

print("Sending request via httpx...")
try:
    with httpx.Client(timeout=10.0) as client:
        response = client.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error occurred: {str(e)}")
