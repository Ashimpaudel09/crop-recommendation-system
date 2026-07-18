import Joi from 'joi';
import { INCOME_SOURCES } from '../models/income.models.js';

const incomeValidationSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than zero',
      'any.required': 'Amount is required'
    }),

  source: Joi.string()
    .valid(...INCOME_SOURCES)
    .required()
    .messages({
      'any.only': `Source must be one of: ${INCOME_SOURCES.join(', ')}`,
      'any.required': 'Income source is required'
    }),

  description: Joi.string()
    .trim()
    .allow('')
    .max(500)
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),

  incomeDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Income date must be a valid date',
      'any.required': 'Income date is required'
    }),

  quantitySold: Joi.number()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'Quantity sold must be a number',
      'number.min': 'Quantity sold cannot be negative'
    }),

  unitPrice: Joi.number()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'Unit price must be a number',
      'number.min': 'Unit price cannot be negative'
    }),

  cropId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Crop ID must be a valid MongoDB ObjectId'
    })
});

export default incomeValidationSchema;