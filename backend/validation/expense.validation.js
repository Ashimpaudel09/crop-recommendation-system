import Joi from 'joi';
import { EXPENSE_CATEGORIES } from '../models/expense.models.js';

const expenseValidationSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than zero',
      'any.required': 'Amount is required'
    }),

  category: Joi.string()
    .valid(...EXPENSE_CATEGORIES)
    .required()
    .messages({
      'any.only': `Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`,
      'any.required': 'Category is required'
    }),

  description: Joi.string()
    .trim()
    .allow('')
    .max(500)
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),

  expenseDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Expense date must be a valid date',
      'any.required': 'Expense date is required'
    }),

  cropId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Crop ID must be a valid MongoDB ObjectId'
    })
});

export default expenseValidationSchema;
