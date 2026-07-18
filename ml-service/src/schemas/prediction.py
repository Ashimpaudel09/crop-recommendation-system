from pydantic import BaseModel
from typing import Literal


class PredictionRequest(BaseModel):
    model: Literal["logistic_regression", "random_forest"]

    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float