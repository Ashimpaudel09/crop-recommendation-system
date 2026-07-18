
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.schemas.prediction import PredictionRequest
from src.services.predictor import predict_crop

app = FastAPI(
    title="Crop Recommendation API",
    description="Crop Recommendation System using Machine Learning",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "status": "running",
        "message": "Crop Recommendation API"
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        data = {
            "N": request.N,
            "P": request.P,
            "K": request.K,
            "temperature": request.temperature,
            "humidity": request.humidity,
            "ph": request.ph,
            "rainfall": request.rainfall,
        }

        return predict_crop(request.model, data)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )