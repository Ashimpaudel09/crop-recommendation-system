import pandas as pd

from services.predictor import scaler


# ==========================================================
# Scale Input Data
# ==========================================================

def scale_input(data):
    """
    Scale input data using the saved Min-Max scaler.
    """

    feature_min = scaler["min"]
    feature_max = scaler["max"]

    data = pd.DataFrame([data])

    denominator = feature_max - feature_min

    # Prevent division by zero
    denominator = denominator.replace(0, 1)

    scaled_data = (data - feature_min) / denominator

    return scaled_data.values