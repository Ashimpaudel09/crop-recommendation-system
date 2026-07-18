import express from 'express';
import { authenticate } from '../middlewares/validation.middlewares.js';
import { getDashboardStats } from '../controllers/dashboard.controllers.js';

const router = express.Router();

router.get('/stats', authenticate, getDashboardStats);

export default router;
