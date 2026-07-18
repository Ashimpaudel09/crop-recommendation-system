import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { connectionDb } from './config/dbconfig.js';
import userRouter from './routes/user.routes.js';
import cropRouter from './routes/crop.routes.js';
import expenseRouter from './routes/expense.routes.js';
import incomeRouter from './routes/income.routes.js';
import farmerRouter from './routes/farmer.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/user/login', authLimiter);
app.use('/api/user/signup', authLimiter);

// Routes
app.use('/api/user', userRouter);
app.use('/api/crop', cropRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/income', incomeRouter);
app.use('/api/farmer', farmerRouter);
app.use('/api/dashboard', dashboardRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// App bootstrap
const startServer = async () => {
  try {
    await connectionDb();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
