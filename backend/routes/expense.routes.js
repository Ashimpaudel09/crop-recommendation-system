import express from 'express';
import {
  validationMiddleware,
  authenticate
} from '../middlewares/validation.middlewares.js';

import {
expenseValidationSchema
} from '../validation/expense.validation.js';

import {
  postexpense,
  getexpense
} from '../controllers/expense.controllers.js';

const router = express.Router();

router.post("/expense",authenticate,validationMiddleware(expenseValidationSchema),postexpense);
router.get("/expense",authenticate,getexpense);


export default router;