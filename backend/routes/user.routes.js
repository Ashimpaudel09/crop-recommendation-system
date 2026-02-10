import express from 'express';

import {
  validationMiddleware,
  authenticate
} from '../middlewares/validation.middlewares.js';

import {
  signupUser,
  getUser,
  loginUser
} from '../controllers/user.controllers.js';

import { signupSchema, loginSchema } from '../validation/user.validation.js';

const router = express.Router();

router.post('/signup', validationMiddleware(signupSchema), signupUser);
router.post('/login', validationMiddleware(loginSchema), loginUser);
router.get('/', authenticate, getUser);

export default router;
