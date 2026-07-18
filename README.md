# 🌾 Crop Recommendation System

A comprehensive, full-stack application built to empower farmers with machine learning-driven crop recommendations and financial tracking tools.

## 🚀 Features
- **Smart Crop Recommendations**: Predicts the optimal crop to plant based on soil metrics (N, P, K, pH) and environmental factors (Temperature, Humidity, Rainfall). Supported by Logistic Regression and Random Forest models.
- **Financial Dashboard**: Track expenses and income associated with farming. View beautiful charts and summaries.
- **Farmer Profiles**: Manage farm details and personal information.
- **Modern UI**: Fully responsive, accessible, and fast interface built with Next.js.

## 🛠️ Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Machine Learning**: Python, FastAPI, Scikit-learn, Pandas, NumPy

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- MongoDB running locally or a MongoDB Atlas URI.

### Setup Instructions
1. Clone the repository and navigate to the project directory.
2. Setup environment variables:
   - In `backend/`, copy `.env.example` to `.env` and fill in `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies:
   - For backend: `cd backend && npm install`
   - For frontend: `cd frontend && npm install`
   - For ML service: `cd ml-service && pip install -r requirements.txt`
   - For root (to run concurrently): `npm install` (if package.json requires it, otherwise just `npm run start` if concurrently is installed globally or via npx)

### Running the Application (All Services)
You can start all 3 services (Frontend, Backend, and ML API) simultaneously using the root package runner:
```bash
npm start
```
This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000
- ML Service on http://localhost:8000

## 📁 Project Structure
- `/frontend`: Next.js web application. See `frontend/README.md`.
- `/backend`: Node.js/Express API. See `backend/README.md`.
- `/ml-service`: Python FastAPI and Jupyter notebooks for ML. See `ml-service/README.md`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is for educational purposes as a B.Sc. CSIT Final Year Project.