import express from 'express';
import {
  validationMiddleware,
  authenticate,
} from '../middlewares/validation.middlewares.js';
import expenseValidationSchema from '../validation/expense.validation.js';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from '../controllers/expense.controllers.js';

const router = express.Router();

router.post('/', authenticate, validationMiddleware(expenseValidationSchema), createExpense);
router.get('/', authenticate, getExpenses);
router.get('/stats', authenticate, getExpenseStats);
router.put('/:id', authenticate, validationMiddleware(expenseValidationSchema), updateExpense);
router.delete('/:id', authenticate, deleteExpense);

export default router;