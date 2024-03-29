"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const addGroup = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    phone_number: joi_1.default.string().length(10).required()
});
exports.default = { addGroup };
