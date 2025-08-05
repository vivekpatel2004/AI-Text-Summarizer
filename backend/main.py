from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = FastAPI()

# Enable CORS to allow frontend requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # You can restrict it in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained BART model and tokenizer for summarization
model_name = "facebook/bart-large-cnn"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

@app.post("/summarize")
async def summarize(request: Request):
    # Receive JSON payload
    data = await request.json()
    text = data.get("text", "")

    # Basic input validation
    if not text.strip():
        return {"summary": "Error: No text provided."}

    # Tokenize the input
    inputs = tokenizer(
        [text],
        max_length=300,
        truncation=True,
        return_tensors="pt"
    )

    summary_ids = model.generate(
    inputs["input_ids"],
    num_beams=4,
    max_length=60,  # 💡 Limits summary length
    min_length=30,
    early_stopping=True
)


    # Decode and return the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return {"summary": summary}
