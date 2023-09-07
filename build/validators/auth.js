"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object().keys({
    phone_number: joi_1.default.string().length(10),
    email: joi_1.default.string().email(),
    password: joi_1.default.string().min(5).required(),
    role: joi_1.default.string().required()
}).xor('phone_number', 'email');
const signupSchema = joi_1.default.object({
    phone_number: joi_1.default.string().length(10).required(),
    password: joi_1.default.string().min(5).required(),
    confirm_password: joi_1.default.string().min(5).required(),
});
const resetPasswordSchema = joi_1.default.object({
    password: joi_1.default.string().min(5),
    confirm_password: joi_1.default.string().min(5).required()
});
const changePasswordSchema = joi_1.default.object({
    password: joi_1.default.string().min(5).required(),
    confirm_password: joi_1.default.string().min(5).required()
});
exports.default = { loginSchema, signupSchema, resetPasswordSchema, changePasswordSchema };
