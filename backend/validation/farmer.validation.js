import Joi from "joi";


export const farmerValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Farmer name is required",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Please provide a valid 10-digit phone number",
    }),

  location: Joi.object({
    provience: Joi.number()
      .required()
      .messages({ "any.required": "Province is required" }),

    district: Joi.string()
      .required()
      .messages({ "string.empty": "District is required" }),

    municipality: Joi.string()
      .required()
      .messages({ "string.empty": "Municipality is required" }),

    ward: Joi.number()
      .required()
      .messages({ "any.required": "Ward is required" }),
  }).required(),

  farmSize: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Farm size must be a number",
      "number.min": "Farm size cannot be negative",
      "any.required": "Farm size is required",
    }),

  irrigationType: Joi.string()
    .valid("Rainfed", "Canal", "Tube well", "Drip", "Sprinkler")
    .default("Rainfed")
    .messages({
      "any.only": "Irrigation type must be one of Rainfed, Canal, Tube well, Drip, Sprinkler",
    }),

  preferredCropCategory: Joi.string()
    .valid("Cereal", "Vegetable", "Fruit", "Cash Crop")
    .messages({
      "any.only": "Preferred crop category must be one of Cereal, Vegetable, Fruit, Cash Crop",
    }),

  investmentLevel: Joi.string()
    .valid("Low", "Medium", "High")
    .default("Medium")
    .messages({
      "any.only": "Investment level must be Low, Medium, or High",
    }),
});