import express from 'express';
import cookieParser from 'cookie-parser';

import { connectionDb } from './config/dbconfig.js';
import userRouter from './routes/user.routes.js';

const app = express();
const PORT =  3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);

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
