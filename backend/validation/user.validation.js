const Joi = require("joi");

const signupSchema = Joi.object({
    firstname: Joi.string()
        .min(3)
        .max(15)
        .required(),

    lastname: Joi.string()
        .min(3)
        .max(15)
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: ["com"] } })
        .required(),

    password: Joi.string()
        .min(8)
        .max(14)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/)
        .required()
}).unknown(false);


const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com"] } }).required(),
    password: Joi.string().required()
}).unknown(false);


module.exports = {signupSchema,loginSchema};