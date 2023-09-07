"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateProfile = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    father_name: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    district: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    pincode: joi_1.default.number().min(100000).max(999999).required(),
    address: joi_1.default.string().required()
});
const updatePinCode = joi_1.default.object().keys({
    pincode: joi_1.default.number().min(100000).max(999999).required()
});
const updateLanguage = joi_1.default.object().keys({
    language: joi_1.default.string().required()
});
const createDonor = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    phone_number: joi_1.default.string().length(10).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    father_name: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    district: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    pincode: joi_1.default.number().min(100000).max(999999).required(),
    address: joi_1.default.string().required(),
    area_rep_id: joi_1.default.number().required(),
    subscription_plan_id: joi_1.default.number().required(),
    is_active: joi_1.default.boolean().required()
});
exports.default = { updateProfile, updatePinCode, updateLanguage, createDonor };
