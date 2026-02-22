import express from 'express';
import {
  validationMiddleware,
  authenticate
} from '../middlewares/validation.middlewares.js';

import {
  incomeValidationSchema
} from '../validation/income.validation.js';

import {
    postIncome,
    getIncome
} from '../controllers/income.controllers.js';

const router = express.Router();
router.post("/income",authenticate,validationMiddleware(incomeValidationSchema),postIncome);
router.get("/income",authenticate,getIncome);

export default router;
