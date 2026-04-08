import os
import joblib
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="SPAM-NOTSPAM DETECTOR API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the base model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "brain", "spam_model.joblib")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please run train_model.py first.")

base_pipeline = joblib.load(MODEL_PATH)

class EmailRequest(BaseModel):
    content: str
    use_ai: bool = False

class PredictionResponse(BaseModel):
    is_spam: bool
    confidence: float
    method: str
    explanation: str = ""

@app.get("/")
def health_check():
    return {"status": "healthy", "model_version": "1.0.0"}

def get_gemini_prediction(content: str):
    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Analyze the following email content and determine if it is SPAM or HAM (Legitimate).
        Respond ONLY with a JSON object in this format:
        {{
            "is_spam": true/false,
            "confidence": 0.0-1.0,
            "explanation": "Brief explanation why"
        }}
        
        Email Content:
        {content}
        """
        response = model.generate_content(prompt)
        # Simple extraction from response text
        import json
        
        # Clean the response text for JSON parsing
        text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None

@app.post("/predict", response_model=PredictionResponse)
async def predict_spam(request: EmailRequest):
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Email content cannot be empty")

    # Method 1: Classic ML (Naive Bayes)
    nb_prediction_prob = base_pipeline.predict_proba([request.content])[0]
    nb_is_spam = bool(base_pipeline.predict([request.content])[0])
    nb_confidence = float(max(nb_prediction_prob))

    # If use_ai is enabled or classic ML is uncertain (e.g., confidence < 0.8)
    if request.use_ai or nb_confidence < 0.7:
        ai_data = get_gemini_prediction(request.content)
        if ai_data:
            return PredictionResponse(
                is_spam=ai_data["is_spam"],
                confidence=ai_data["confidence"],
                method="AI (Gemini-Pro)",
                explanation=ai_data["explanation"]
            )

    return PredictionResponse(
        is_spam=nb_is_spam,
        confidence=nb_confidence,
        method="Classic ML (Naive Bayes)",
        explanation="Detected using text pattern frequency."
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
