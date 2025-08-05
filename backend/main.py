import os
import requests
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production me specific domains bhi rakh sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HuggingFace API token environment variable se lo
HF_API_TOKEN = os.getenv("HF_API_TOKEN")

headers = {
    "Authorization": f"Bearer {HF_API_TOKEN}"
}

@app.post("/summarize")
async def summarize(request: Request):
    data = await request.json()
    text = data.get("text", "")

    if not text.strip():
        return {"summary": "Error: No text provided."}

    API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

    payload = {
        "inputs": text,
        "parameters": {
            "max_length": 60,
            "min_length": 30,
            "num_beams": 4
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return {"summary": "Error: Unable to get summary from HuggingFace API."}

    # response json is a list with summary_text key
    summary = response.json()[0].get("summary_text", "No summary found.")

    return {"summary": summary}
