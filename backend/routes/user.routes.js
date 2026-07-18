import express from 'express';
import {
  validationMiddleware,
  authenticate,
} from '../middlewares/validation.middlewares.js';
import {
  signupUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from '../controllers/user.controllers.js';
import { signupSchema, loginSchema } from '../validation/user.validation.js';

const router = express.Router();

router.post('/signup', validationMiddleware(signupSchema), signupUser);
router.post('/login', validationMiddleware(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/me', authenticate, getCurrentUser);

export default router;
