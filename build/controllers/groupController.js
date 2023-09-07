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
const config_1 = require("../config");
const password_verify_1 = require("../utils/password_verify");
const addGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone_number } = req.body;
        const donor = yield prisma_init_1.default.donorGroup.create({ data: { name: name, phone_number: phone_number, donor_id: Number(req.user_id) } });
        res.json({ donor });
    }
    catch (error) {
        next(error);
    }
});
const getGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const donorGroup = yield prisma_init_1.default.donor.findUnique({
            where: { id: Number(id) },
            select: { donor_groups: true }
        });
        res.json(donorGroup);
    }
    catch (error) {
        next(error);
    }
});
const getParticularGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const donorGroup = yield prisma_init_1.default.donorGroup.findUnique({
            where: { id: Number(id) },
        });
        res.json(donorGroup);
    }
    catch (error) {
        next(error);
    }
});
const editParticularGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const donorGroup = yield prisma_init_1.default.donorGroup.update({
            where: { id: Number(id) },
            data: Object.assign({}, req.body)
        });
        res.json(donorGroup);
    }
    catch (error) {
        next(error);
    }
});
const verifyGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { otp } = req.body;
        const groupMember = yield prisma_init_1.default.donorGroup.findUnique({ where: { id: Number(id) } });
        if (groupMember) {
            if (otp == groupMember.otp) {
                yield prisma_init_1.default.donorGroup.update({ where: { id: Number(id) }, data: { is_verified: true } });
                res.send({ "message": "otp verified successfully" });
            }
            else {
                next((0, http_errors_1.default)(422, 'otp verification failed'));
            }
        }
        else {
            res.send({ "message": "group account is not present" });
        }
    }
    catch (error) {
        next(error);
    }
});
const deleteParticlarGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_init_1.default.donorGroup.update({ where: { id: Number(id) }, data: { deleted_at: new Date() } });
        res.send({ "message": "group member deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
const promoteToDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var donor = yield prisma_init_1.default.donor.findUnique({ where: { phone_number: req.body.phone_number } });
        if (donor) {
            next(http_errors_1.default.Conflict('phone number already linked to other account'));
        }
        donor = yield prisma_init_1.default.donor.findUnique({ where: { email: req.body.email } });
        if (donor) {
            next(http_errors_1.default.Conflict('email already linked to other account'));
        }
        req.body.password = config_1.DEFAULT_PASSWORD;
        const hash = yield (0, password_verify_1.generateHashPass)(req);
        donor = yield prisma_init_1.default.donor.create({ data: Object.assign(Object.assign({}, req.body), { password: hash }) });
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
const promoteToHead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const groupMember = yield prisma_init_1.default.donorGroup.findUnique({
            where: { id: Number(id) },
            select: {
                name: true,
                phone_number: true,
                donor: {
                    select: {
                        name: true,
                        phone_number: true
                    }
                }
            }
        });
        const new_donor_name = (groupMember === null || groupMember === void 0 ? void 0 : groupMember.name) || '';
        const new_donor_phone = groupMember === null || groupMember === void 0 ? void 0 : groupMember.phone_number;
        const new_grp_member_name = groupMember === null || groupMember === void 0 ? void 0 : groupMember.donor.name;
        const new_grp_member_phone = groupMember === null || groupMember === void 0 ? void 0 : groupMember.donor.phone_number;
        const updated = yield prisma_init_1.default.donorGroup.update({
            where: { id: Number(id) },
            data: {
                name: new_grp_member_name || '',
                phone_number: new_grp_member_phone,
                donor: {
                    update: {
                        name: new_donor_name,
                        phone_number: new_donor_phone,
                        is_otp_verified: false
                    }
                }
            }
        });
        res.send(updated);
    }
    catch (error) {
        next(error);
    }
});
exports.default = { addGroupMember, getGroupMember, getParticularGroupMember, editParticularGroupMember, deleteParticlarGroupMember, promoteToDonor, promoteToHead, verifyGroupMember };
