from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Load efficient summarization model (faster + smaller)
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-6-6")

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/summarize")
async def summarize_text(payload: TextRequest):
    try:
        text = payload.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        # Determine max length based on input size
        input_len = len(text.split())

        # Dynamic summary length (fast + avoids warnings)
        max_len = min(80, input_len - 5) if input_len > 25 else input_len

        result = summarizer(
            text,
            max_length=max_len,
            min_length=20,
            do_sample=False
        )
        
        summary = result[0]["summary_text"]
        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Text Summarization API is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
