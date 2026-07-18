import Joi from 'joi';

export const farmerValidationSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Please provide a valid 10-digit phone number',
    }),

  location: Joi.object({
    province: Joi.string().allow('', null),
    district: Joi.string().allow('', null),
    municipality: Joi.string().allow('', null),
    ward: Joi.number().min(1).allow(null),
  }).allow(null),

  farmSize: Joi.number()
    .min(0)
    .allow(null)
    .messages({
      'number.base': 'Farm size must be a number',
      'number.min': 'Farm size cannot be negative',
    }),

  irrigationType: Joi.string()
    .valid('Rainfed', 'Canal', 'Tube well', 'Drip', 'Sprinkler')
    .allow('', null)
    .messages({
      'any.only': 'Irrigation type must be one of Rainfed, Canal, Tube well, Drip, Sprinkler',
    }),

  preferredCropCategory: Joi.string()
    .valid('Cereal', 'Vegetable', 'Fruit', 'Cash Crop')
    .allow('', null)
    .messages({
      'any.only': 'Preferred crop category must be one of Cereal, Vegetable, Fruit, Cash Crop',
    }),
});