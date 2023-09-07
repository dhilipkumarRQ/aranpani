"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_init_1 = __importDefault(require("../utils/prisma_init"));
const password_verify_1 = require("../utils/password_verify");
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, phone_number } = req.body;
        const hash = yield (0, password_verify_1.generateHashPass)(req);
        const admin = yield prisma_init_1.default.user.create({
            data: { email: email, name: name, phone_number: phone_number, password: hash, role: 'admin', otp: 1111 }
        });
        res.json(admin);
    }
    catch (error) {
        next(error);
    }
});
exports.default = { createAdmin };
