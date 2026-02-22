import Joi from 'joi';

const farmerValidationSchema = Joi.object({
  user: Joi.forbidden(),

  address: Joi.string()
    .trim()
    .min(5)
    .max(150)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address must not exceed 150 characters'
    })
});

export default farmerValidationSchema;