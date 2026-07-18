import express from 'express';
import { authenticate } from '../middlewares/validation.middlewares.js';
import {
  getProfile,
  upsertProfile,
} from '../controllers/farmer.controllers.js';

const router = express.Router();

router.get('/', authenticate, getProfile);
router.put('/', authenticate, upsertProfile);

export default router;