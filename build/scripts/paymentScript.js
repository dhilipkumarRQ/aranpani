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
const getDonorDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payment_details = [];
    const donors = yield prisma_init_1.default.donor.findMany({
        where: {
            is_otp_verified: true
        },
        select: {
            id: true,
            name: true,
            phone_number: true,
            subscription_plan: {
                select: {
                    plan_name: true,
                    payment_cycle: true,
                    payment_amount: true
                }
            },
            donor_groups: {
                where: {
                    deleted_at: {
                        equals: null
                    }
                },
                select: {
                    id: true,
                    name: true,
                    phone_number: true
                }
            }
        }
    });
    for (const donor of donors) {
        const numOfDonors = donor.donor_groups.length ? donor.donor_groups.length + 1 : 1;
        var payment = {};
        payment.payment_status_id = Number(1);
        payment.amount = numOfDonors * Number((_a = donor.subscription_plan) === null || _a === void 0 ? void 0 : _a.payment_amount);
        payment.donor_id = donor.id;
        payment_details.push(payment);
    }
    yield prisma_init_1.default.payment.createMany({ data: [...payment_details] });
});
getDonorDetails();
