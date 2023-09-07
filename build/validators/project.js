"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createProject = joi_1.default.object().keys({
    temple_name: joi_1.default.string().required(),
    temple_incharge_name: joi_1.default.string().required(),
    contact: joi_1.default.string().length(10).regex(/^\d+$/).required(),
    location: joi_1.default.string().required()
});
const status = joi_1.default.object().keys({
    status: joi_1.default.string().required(),
    start_date: joi_1.default.date(),
    end_date: joi_1.default.date(),
    estimate_amount: joi_1.default.number(),
    expensed_amount: joi_1.default.number()
});
const plannedState = joi_1.default.object().keys({
    status: joi_1.default.string().required(),
    start_date: joi_1.default.date().required(),
    end_date: joi_1.default.date().required(),
    estimate_amount: joi_1.default.number().min(1).required(),
    expensed_amount: joi_1.default.number().min(1).required()
});
exports.default = { createProject, status, plannedState };
