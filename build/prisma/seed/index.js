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
const prisma_init_1 = __importDefault(require("../../utils/prisma_init"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_init_1.default.subscriptionPlan.deleteMany();
        yield prisma_init_1.default.subscriptionPlan.create({
            data: {
                id: 1,
                plan_name: "monthly plan",
                payment_cycle: 1,
                payment_amount: 100,
                is_active: true,
            }
        });
        yield prisma_init_1.default.subscriptionPlan.create({
            data: {
                id: 2,
                plan_name: "quarterly scheme",
                payment_cycle: 3,
                payment_amount: 300,
                is_active: true,
            }
        });
        yield prisma_init_1.default.subscriptionPlan.create({
            data: {
                id: 3,
                plan_name: "half yearly scheme",
                payment_cycle: 6,
                payment_amount: 600,
                is_active: true,
            }
        });
        yield prisma_init_1.default.subscriptionPlan.create({
            data: {
                id: 4,
                plan_name: "annual scheme",
                payment_cycle: 12,
                payment_amount: 1200,
                is_active: true,
            }
        });
        yield prisma_init_1.default.paymentStatus.deleteMany();
        yield prisma_init_1.default.paymentStatus.create({
            data: {
                id: 1,
                status: "pending",
            }
        });
        yield prisma_init_1.default.paymentStatus.create({
            data: {
                id: 2,
                status: "paid",
            }
        });
        yield prisma_init_1.default.paymentStatus.create({
            data: {
                id: 3,
                status: "paid by rep",
            }
        });
        yield prisma_init_1.default.paymentStatus.create({
            data: {
                id: 4,
                status: "pending with rep",
            }
        });
        yield prisma_init_1.default.paymentStatus.create({
            data: {
                id: 5,
                status: "not paid",
            }
        });
    });
}
main();
