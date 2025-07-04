from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from joblib import load
import numpy as np
import pandas as pd
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import status

app = FastAPI()

# ✅ New root route
@app.get("/")
async def root():
    return {"message": "🎓 Student Stress Prediction API is running successfully!"}

# Handle validation errors nicely
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print("Validation error:", exc)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors()}),
    )

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
try:
    model = load("xgb_stress_model.joblib")
    scaler = load("scaler.joblib")
    print("Model and scaler loaded successfully")
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    model = None
    scaler = None

# Input schema
class InputData(BaseModel):
    anxiety_level: int = Field(..., ge=0, le=20)
    self_esteem: int = Field(..., ge=0, le=30)
    mental_health_history: int = Field(..., ge=0, le=1)
    depression: int = Field(..., ge=0, le=27)
    headache: int = Field(..., ge=0, le=5)
    blood_pressure: int = Field(..., ge=0, le=3)
    sleep_quality: int = Field(..., ge=0, le=5)
    breathing_problem: int = Field(..., ge=0, le=5)
    noise_level: int = Field(..., ge=0, le=5)
    living_conditions: int = Field(..., ge=0, le=5)
    safety: int = Field(..., ge=0, le=5)
    basic_needs: int = Field(..., ge=0, le=5)
    academic_performance: int = Field(..., ge=0, le=5)
    study_load: int = Field(..., ge=0, le=5)
    teacher_student_relationship: int = Field(..., ge=0, le=5)
    future_career_concerns: int = Field(..., ge=0, le=5)
    social_support: int = Field(..., ge=0, le=5)
    peer_pressure: int = Field(..., ge=0, le=5)
    extracurricular_activities: int = Field(..., ge=0, le=5)
    bullying: int = Field(..., ge=0, le=5)

@app.post("/predict")
async def predict(data: InputData):
    if model is None or scaler is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"detail": "Model or scaler not available. Please try again later."}
        )
    
    feature_names = list(data.dict().keys())
    features = pd.DataFrame([[getattr(data, col) for col in feature_names]], columns=feature_names)

    try:
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0].tolist()

        return {
            "prediction": int(prediction),
            "probability": probability
        }

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"Error computing prediction: {str(e)}"}
        )

@app.get("/model-info")
async def model_info():
    if model is None:
        return {"status": "Model not loaded"}
    
    return {
        "type": type(model).__name__,
        "features": 20,
        "classes": [0, 1, 2]
    }

@app.get("/health")
async def health_check():
    if model is None or scaler is None:
        return {"status": "warning", "message": "Model or scaler not loaded"}
    return {"status": "ok", "model_loaded": True, "scaler_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

