import Joi from 'joi';

const incomeValidationSchema = Joi.object({
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId'
    }),

  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than zero',
      'any.required': 'Amount is required'
    }),

  source: Joi.string()
    .valid('crop_sale', 'livestock', 'subsidy', 'grant')
    .required()
    .messages({
      'any.only': 'Source must be crop_sale, livestock, subsidy, or grant',
      'any.required': 'Income source is required'
    }),

  incomeDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Income date must be a valid date',
      'any.required': 'Income date is required'
    }),

  quantity_sold: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Quantity sold must be a number',
      'number.min': 'Quantity sold cannot be negative'
    }),

  uintPrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.base': 'Unit price must be a number',
      'number.positive': 'Unit price must be greater than zero'
    }),

  cropId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Crop ID is required',
      'string.pattern.base': 'Crop ID must be a valid MongoDB ObjectId'
    })
});

export default incomeValidationSchema;