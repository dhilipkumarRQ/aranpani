import Joi from "joi";

const loginSchema = Joi.object().keys({
    phone_number: Joi.string().length(10),
    email: Joi.string().email(),
    password: Joi.string().min(5).required(),
    role: Joi.string().required()
}).xor('phone_number','email');

const signupSchema = Joi.object({
    phone_number: Joi.string().length(10).required(),
    password: Joi.string().min(5).required(),
    confirm_password: Joi.string().min(5).required(),
});

const resetPasswordSchema = Joi.object({
    password: Joi.string().min(5),
    confirm_password: Joi.string().min(5).required()
})

const changePasswordSchema = Joi.object({
    password: Joi.string().min(5).required(),
    confirm_password: Joi.string().min(5).required()
})

export default {loginSchema, signupSchema, resetPasswordSchema, changePasswordSchema}