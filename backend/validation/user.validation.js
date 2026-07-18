import Joi from 'joi';

export const signupSchema = Joi.object({
  firstname: Joi.string()
    .min(3)
    .max(15)
    .required(),

  lastname: Joi.string()
    .min(3)
    .max(15)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(14)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must include uppercase, lowercase, number, and special character',
    }),
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
}).unknown(false);
