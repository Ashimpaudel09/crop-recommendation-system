# ⚙️ Backend - Crop Recommendation System

This directory contains the Node.js API that serves the frontend, manages the MongoDB database, and proxies requests to the Machine Learning service.

## 🚀 Features
- **User Authentication**: JWT-based authentication.
- **Database Management**: Mongoose schemas for Users, Crops, Expenses, and Incomes.
- **Data Aggregation**: Aggregation pipelines for generating financial statistics.

## 🛠️ Technologies
- **Node.js & Express**
- **MongoDB & Mongoose**
- **JSON Web Tokens (JWT)**
- **Bcrypt.js** for password hashing
- **Axios** (for communicating with the ML service)

## 📦 Setup & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/crop_recommendation
   JWT_SECRET=your_super_secret_key
   ML_SERVICE_URL=http://127.0.0.1:8000
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛣️ API Endpoints Overview
- `/api/user/*` - Auth and profiles
- `/api/crop/*` - Crop management and ML prediction requests
- `/api/expense/*` - Expense tracking
- `/api/income/*` - Income tracking
- `/api/dashboard/*` - Financial statistics
