import Joi from 'joi';

const cropValidationSchema = Joi.object({
  user: Joi.forbidden(),

  cropName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Crop name is required',
      'string.min': 'Crop name must be at least 2 characters',
      'string.max': 'Crop name must not exceed 50 characters'
    }),

  plantingDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Planting date must be a valid date',
      'any.required': 'Planting date is required'
    }),

  harvestDate: Joi.date()
    .greater(Joi.ref('plantingDate'))
    .optional()
    .messages({
      'date.base': 'Harvest date must be a valid date',
      'date.greater': 'Harvest date must be after planting date'
    }),

  status: Joi.string()
    .valid('growing', 'harvested', 'failed')
    .default('growing')
    .messages({
      'any.only': 'Status must be growing, harvested, or failed'
    })
});

export default cropValidationSchema;
