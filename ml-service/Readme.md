# 🧠 Machine Learning Service

This directory contains the machine learning pipelines, Jupyter notebooks for data analysis, and a FastAPI server for serving predictions.

## 🚀 Features
- **Data Preprocessing**: Cleaning and scaling agricultural data.
- **Model Training**: Jupyter notebooks demonstrating Exploratory Data Analysis (EDA) and training of Logistic Regression and Random Forest models.
- **Inference API**: A lightweight FastAPI server to expose the trained models via a REST endpoint.

## 🛠️ Technologies
- **Python 3.9+**
- **FastAPI & Uvicorn** for the API
- **Scikit-learn, Pandas, NumPy** for ML
- **Pickle** for model serialization

## 📦 Setup & Running
1. It is recommended to use a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   python -m uvicorn src.app:app --port 8000 --reload
   ```

## 📁 Structure
- `/notebook`: Jupyter notebooks with EDA and model training steps.
- `/src`: The FastAPI application and prediction logic.
- `/saved_models`: Serialized `.pkl` models and scalers.
- `/data`: The dataset (`Crop_recommendation.csv`) and processed data.
