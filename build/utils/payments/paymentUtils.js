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
const prisma_init_1 = __importDefault(require("../prisma_init"));
const getListOfDonor = (donor_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const donor = yield prisma_init_1.default.donor.findUnique({
        where: {
            id: Number(donor_id),
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
    var donor_details = [];
    const payment_amount = Number((_a = donor === null || donor === void 0 ? void 0 : donor.subscription_plan) === null || _a === void 0 ? void 0 : _a.payment_amount) * 100;
    donor_details.push({ name: `${donor === null || donor === void 0 ? void 0 : donor.name} ${(donor === null || donor === void 0 ? void 0 : donor.donor_groups.length) ? "(family head)" : ''}`,
        phone_number: donor === null || donor === void 0 ? void 0 : donor.phone_number,
        payment_amount: payment_amount });
    for (const member of (donor === null || donor === void 0 ? void 0 : donor.donor_groups) || []) {
        donor_details.push({ name: member.name,
            phone_number: member.phone_number,
            payment_amount: payment_amount
        });
    }
    return donor_details;
});
exports.default = { getListOfDonor };
