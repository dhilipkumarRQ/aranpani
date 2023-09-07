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
const http_errors_1 = __importDefault(require("http-errors"));
const password_verify_1 = require("../utils/password_verify");
const createDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone_number, email, father_name, country, district, state, pincode, address, area_rep_id, subscription_plan_id, is_active } = req.body;
        const hash = yield (0, password_verify_1.generateHashPass)(req);
        const donor = yield prisma_init_1.default.donor.create({ data: {
                name: name,
                phone_number: phone_number,
                email: email,
                father_name: father_name,
                password: hash,
                country: country,
                district: district,
                state: state,
                pincode: pincode,
                address: address,
                area_rep_id: area_rep_id,
                subscription_plan_id: subscription_plan_id,
                is_active: is_active
            } });
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
const getDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { search, limit, offset, sort, order } = req.query;
        const orderBy = { [String(sort)]: order ? 'asc' : 'desc' };
        const page = (Number(offset) / Number(limit)) + 1;
        var donor;
        if (search) {
            search = String(search);
            donor = yield prisma_init_1.default.donor.findMany({
                where: {
                    OR: [
                        { name: { contains: search }, },
                        { phone_number: { contains: search } },
                        { id: { equals: isNaN(parseInt(search)) ? undefined : Number(search) } },
                    ]
                },
                orderBy,
                skip: offset ? Number(offset) : undefined,
                take: offset ? Number(limit) : undefined
            });
        }
        else {
            donor = yield prisma_init_1.default.donor.findMany({
                orderBy,
                skip: offset ? Number(offset) : undefined,
                take: offset ? Number(limit) : undefined
            });
        }
        res.json({ donor, "page": page ? page : 1 });
    }
    catch (error) {
        next(error);
    }
});
const getSingleDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const donor = yield prisma_init_1.default.donor.findUnique({ where: { id: Number(id) } });
        if (donor) {
            res.json(donor);
        }
        else {
            res.send({ "message": "account not present" }).status(404);
        }
    }
    catch (error) {
        next(error);
    }
});
const updateSingleDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    res.send({ "message": "account updated..." }).status(404);
});
const decativateDonorAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
const getAreaRep = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const donor = yield prisma_init_1.default.donor.findUnique({ where: { id: Number(id) } });
        if (donor) {
            if (donor.area_rep_id) {
                const area_rep = yield prisma_init_1.default.donor.findUnique({ where: { id: donor.area_rep_id } });
                res.json(area_rep);
            }
            else {
                res.send({ "message": "no area rep assigned" });
            }
        }
        else {
            res.send({ "message": "account not found" }).status(404);
        }
    }
    catch (error) {
        next(error);
    }
});
const completeDonorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, father_name, country, district, state, pincode, address } = req.body;
        var donor = yield prisma_init_1.default.donor.findUnique({ where: { id: req.user_id } });
        if (donor) {
            if (donor.is_otp_verified) {
                donor = yield prisma_init_1.default.donor.update({
                    where: { id: req.user_id, is_otp_verified: true, is_active: true },
                    data: {
                        name: name,
                        email: email,
                        father_name: father_name,
                        country: country,
                        district: district,
                        state: state,
                        pincode: pincode,
                        address: address
                    }
                });
                res.json(donor);
            }
            else {
                //redirect to otp page
                res.send({ 'message': 'please verifiy otp, redirecting to otp page' });
            }
        }
        else {
            next((0, http_errors_1.default)(404, 'account not found'));
        }
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
const updateLocation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pincode } = req.body;
        const donor = yield prisma_init_1.default.donor.update({
            where: { id: req.user_id, is_active: true },
            data: { pincode: pincode, }
        });
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
const updateLanguage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { language } = req.body;
        const donor = yield prisma_init_1.default.donor.update({
            where: { id: req.user_id, is_active: true },
            data: { language: language, }
        });
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
exports.default = { createDonor, getDonor, getSingleDonor, updateSingleDonor, decativateDonorAccount, getAreaRep, completeDonorProfile, updateLocation, updateLanguage };
