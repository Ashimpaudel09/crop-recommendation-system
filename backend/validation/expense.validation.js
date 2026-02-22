import Joi from 'joi';

const expenseValidationSchema = Joi.object({
  user: Joi.forbidden(),
  
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than zero',
      'any.required': 'Amount is required'
    }),

  category: Joi.string()
    .valid('seed', 'fertilizer', 'labor', 'machinery', 'pesticide')
    .required()
    .messages({
      'any.only': 'Category must be seed, fertilizer, labor, machinery, or pesticide',
      'any.required': 'Category is required'
    }),

  description: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 5 characters',
      'string.max': 'Description must not exceed 200 characters'
    }),

  expenseDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Expense date must be a valid date',
      'any.required': 'Expense date is required'
    }),

  cropId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Crop ID is required',
      'string.pattern.base': 'Crop ID must be a valid MongoDB ObjectId'
    })
});

export default expenseValidationSchema;
