import express from 'express';
import {
  validationMiddleware,
  authenticate,
} from '../middlewares/validation.middlewares.js';
import incomeValidationSchema from '../validation/income.validation.js';
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  getIncomeStats,
} from '../controllers/income.controllers.js';

const router = express.Router();

router.post('/', authenticate, validationMiddleware(incomeValidationSchema), createIncome);
router.get('/', authenticate, getIncomes);
router.get('/stats', authenticate, getIncomeStats);
router.put('/:id', authenticate, validationMiddleware(incomeValidationSchema), updateIncome);
router.delete('/:id', authenticate, deleteIncome);

export default router;
