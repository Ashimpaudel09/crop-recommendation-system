from pathlib import Path
from collections import Counter

import json
import pickle
import numpy as np
import pandas as pd


# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_DIR = BASE_DIR / "saved_models"


# ==========================================================
# Load Logistic Regression Model
# ==========================================================

with open(MODEL_DIR / "logistic_regression.pkl", "rb") as file:
    logistic_model = pickle.load(file)


# ==========================================================
# Load Random Forest Model
# ==========================================================

with open(MODEL_DIR / "random_forest_model.pkl", "rb") as file:
    random_forest_model = pickle.load(file)


# ==========================================================
# Load Min-Max Scaler
# ==========================================================

with open(MODEL_DIR / "minmax_scaler.pkl", "rb") as file:
    scaler = pickle.load(file)


# ==========================================================
# Load Label Mapping
# ==========================================================

with open(MODEL_DIR / "label_mapping.json", "r") as file:
    label_to_index = json.load(file)

index_to_label = {
    value: key
    for key, value in label_to_index.items()
}


# ==========================================================
# Scale Input
# ==========================================================

def scale_input(data):
    """
    Scale input features using the saved Min-Max scaler.
    """

    feature_min = scaler["min"]
    feature_max = scaler["max"]

    data = pd.DataFrame([data])

    denominator = feature_max - feature_min

    # Prevent division by zero
    denominator = denominator.replace(0, 1)

    scaled_data = (data - feature_min) / denominator

    return scaled_data.values


# ==========================================================
# Softmax
# ==========================================================

def softmax(z):
    """
    Compute Softmax probabilities.
    """

    exp = np.exp(z - np.max(z, axis=1, keepdims=True))

    return exp / np.sum(exp, axis=1, keepdims=True)


# ==========================================================
# Logistic Regression Prediction
# ==========================================================

def predict_logistic(model, X):
    """
    Predict crop using Logistic Regression.
    """

    weights = model["weights"]
    bias = model["bias"]

    scores = np.dot(X, weights) + bias
    probabilities = softmax(scores)

    # Return top 3 indices for the first sample
    top_3_indices = np.argsort(probabilities[0])[-3:][::-1]
    
    return top_3_indices


# ==========================================================
# Decision Tree Prediction (Used by Random Forest)
# ==========================================================

def predict_sample(tree, sample):
    """
    Predict a single sample using one Decision Tree.
    """

    if not isinstance(tree, dict):
        return tree

    feature = tree["feature"]
    threshold = tree["threshold"]

    if sample[feature] <= threshold:
        return predict_sample(tree["left"], sample)

    return predict_sample(tree["right"], sample)


# ==========================================================
# Majority Voting
# ==========================================================

def majority_vote(predictions):
    """
    Return the most common prediction.
    """

    return Counter(predictions).most_common(3)


# ==========================================================
# Random Forest Prediction
# ==========================================================

def predict_random_forest(forest, X):
    """
    Predict crop using Random Forest.
    """

    sample = X[0]
    tree_predictions = []

    for tree in forest:
        tree_predictions.append(
            predict_sample(tree, sample)
        )

    most_common = majority_vote(tree_predictions)
    top_3 = [item[0] for item in most_common]

    if len(top_3) < 3:
        for cls in index_to_label.keys():
            if cls not in top_3:
                top_3.append(cls)
            if len(top_3) == 3:
                break

    return top_3


# ==========================================================
# Main Prediction Function
# ==========================================================

def predict_crop(model_name, data):
    """
    Predict crop using the selected model.
    """

    scaled_data = scale_input(data)

    if model_name == "logistic_regression":
        top_3 = predict_logistic(
            logistic_model,
            scaled_data
        )

    elif model_name == "random_forest":
        top_3 = predict_random_forest(
            random_forest_model,
            scaled_data
        )

    else:
        raise ValueError("Invalid model selected.")

    return {
        "model": model_name,
        "predictions": [index_to_label[int(idx)] for idx in top_3]
    }