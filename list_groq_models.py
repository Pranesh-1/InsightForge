
import os
import httpx
from dotenv import load_dotenv

load_dotenv("backend/.env")
api_key = os.getenv("GROQ_API_KEY")

url = "https://api.groq.com/openai/v1/models"
headers = {"Authorization": f"Bearer {api_key}"}

try:
    with httpx.Client() as client:
        response = client.get(url, headers=headers)
        if response.status_code == 200:
            models = [m["id"] for m in response.json()["data"]]
            print("Available models:")
            for m in sorted(models):
                print(f" - {m}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error: {e}")
