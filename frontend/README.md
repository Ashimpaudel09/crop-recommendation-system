# 🌾 Frontend - Crop Recommendation System

This directory contains the user interface for the Crop Recommendation System, built with Next.js and Tailwind CSS.

## 🚀 Features
- **Authentication**: Secure login and signup flows.
- **Dashboard**: Overview of farm finances and recent activities.
- **Crop Prediction**: Interface to input soil and weather data to get ML predictions.
- **Financial Tracking**: Dedicated pages for logging expenses and income.

## 🛠️ Technologies
- **Next.js** (App Router)
- **React**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API requests
- **React Hook Form & Zod** for form validation

## 📦 Setup & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 in your browser.

## 🔗 Environment Variables
Create a `.env.local` if you need to override the backend API URL. By default, it looks for the backend at `http://localhost:5000/api`.
