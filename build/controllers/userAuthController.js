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
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
const jwt_token_1 = require("../utils/jwt_token");
const config_2 = require("../config");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number, password, email, role } = req.body;
    if (role == config_2.Roles.ADMIN || role == config_2.Roles.SUPER_ADMIN) {
        if (!email) {
            return next((0, http_errors_1.default)(422, 'cannot proceess the request'));
        }
        const user = yield prisma_init_1.default.user.findUnique({
            where: {
                email: email,
            }
        });
        if (!user) {
            return next(http_errors_1.default.Conflict('admin account not present'));
        }
        const isMatch = yield (0, password_verify_1.comparePassword)(password, user.password);
        if (isMatch) {
            var token;
            if (user.role == config_2.Roles.ADMIN) {
                token = yield (0, jwt_token_1.generateToken)(user, config_2.Roles.ADMIN);
            }
            else {
                token = yield (0, jwt_token_1.generateToken)(user, config_2.Roles.SUPER_ADMIN);
            }
            res.send({ "access_token": token });
        }
        else {
            next((0, http_errors_1.default)(422, 'password is incorrect'));
        }
    }
    else if (role == config_2.Roles.DONOR || role == config_2.Roles.AREA_REP) {
        if (!phone_number) {
            return next((0, http_errors_1.default)(422, 'cannot proceess the request'));
        }
        const user = yield prisma_init_1.default.donor.findUnique({
            where: {
                phone_number: phone_number,
                is_active: true
            }
        });
        if (!user) {
            return next(http_errors_1.default.Conflict('donor account not present'));
        }
        if (!user.is_otp_verified) {
            return next(http_errors_1.default.Forbidden('please verify otp'));
        }
        const isMatch = yield (0, password_verify_1.comparePassword)(password, user.password);
        if (isMatch) {
            var token;
            if (user.area_rep_id == null) {
                token = yield (0, jwt_token_1.generateToken)(user, config_2.Roles.DONOR);
            }
            else {
                token = yield (0, jwt_token_1.generateToken)(user, config_2.Roles.AREA_REP);
            }
            res.send({ "access_token": token });
        }
        else {
            next((0, http_errors_1.default)(422, 'password is incorrect'));
        }
    }
    else {
        next((0, http_errors_1.default)(422, 'incorrect role'));
    }
});
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number, password, confirm_password } = req.body;
    if (password != confirm_password) {
        next((0, http_errors_1.default)(422, 'password and confirm password mismatch'));
    }
    const isDonorExist = yield prisma_init_1.default.donor.findUnique({
        where: {
            phone_number: phone_number
        }
    });
    if (isDonorExist) {
        return next(http_errors_1.default.Conflict('donor with this phone number is already present'));
    }
    const hash = yield (0, password_verify_1.generateHashPass)(req);
    try {
        const donor = yield prisma_init_1.default.donor.create({
            data: {
                phone_number: req.body.phone_number,
                password: hash,
                otp: config_1.OTP
            }
        });
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
const verify_otp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const donor = yield prisma_init_1.default.donor.findUnique({ where: { id: req.user_id } });
    if (donor) {
        if (donor.otp == req.body.otp) {
            yield prisma_init_1.default.donor.update({
                where: {
                    id: req.user_id
                },
                data: {
                    is_otp_verified: true,
                }
            });
            var token;
            if (donor.area_rep_id == null) {
                token = yield (0, jwt_token_1.generateToken)(donor, config_2.Roles.DONOR);
            }
            else {
                token = yield (0, jwt_token_1.generateToken)(donor, config_2.Roles.AREA_REP);
            }
            return res.json({ "message": 'otp verification successful',
                "token": token });
        }
        else {
            return next((0, http_errors_1.default)(400, 'otp incorrect'));
        }
    }
    next((0, http_errors_1.default)(404, 'user account not present'));
});
const forgot_password = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.role == config_2.Roles.DONOR) {
        const donor = yield prisma_init_1.default.donor.findUnique({ where: { phone_number: req.body.phone_number } });
        if (donor) {
            // send otp to number
            return res.send({ "message": "otp send to phone number" });
        }
        else {
            next((0, http_errors_1.default)(404, 'donor account not present'));
        }
    }
    else if (req.body.role == config_2.Roles.ADMIN) {
        const admin = yield prisma_init_1.default.user.findUnique({ where: { phone_number: req.body.phone_number } });
        if (admin) {
            // send otp to email
            return res.send({ "message": "otp send to email" });
        }
        else {
            next((0, http_errors_1.default)(404, 'admin account not present'));
        }
    }
    next((0, http_errors_1.default)(422, 'incorrect role'));
});
const reset_password = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password != req.body.confirm_password) {
        next((0, http_errors_1.default)(422, 'confirm password mismatch'));
    }
    const hash = yield (0, password_verify_1.generateHashPass)(req);
    if (req.role == config_2.Roles.DONOR || req.role == config_2.Roles.AREA_REP) {
        const donor = yield prisma_init_1.default.donor.findUnique({ where: { id: req.user_id } });
        if (donor) {
            yield prisma_init_1.default.donor.update({ where: { id: req.user_id }, data: { password: hash } });
            return res.send({ "message": "password updated successfully" });
        }
        else {
            next((0, http_errors_1.default)(404, 'donor account not present'));
        }
    }
    else if (req.role == config_2.Roles.ADMIN || req.role == config_2.Roles.SUPER_ADMIN) {
        const admin = yield prisma_init_1.default.user.findUnique({ where: { id: req.user_id } });
        if (admin) {
            yield prisma_init_1.default.user.update({ where: { id: req.user_id }, data: { password: hash } });
            return res.send({ "message": "password updated successfully" });
        }
        else {
            next((0, http_errors_1.default)(404, 'admin account not present'));
        }
    }
    next((0, http_errors_1.default)(422, 'incorrect role'));
});
const change_password = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield (0, password_verify_1.generateHashPass)(req);
    if (req.role == config_2.Roles.DONOR || req.role == config_2.Roles.AREA_REP) {
        const donor = yield prisma_init_1.default.donor.findUnique({ where: { id: req.user_id } });
        const isMatch = yield (0, password_verify_1.comparePassword)(req.body.password, donor.password);
        if (isMatch) {
            if (donor) {
                yield prisma_init_1.default.donor.update({ where: { id: req.user_id }, data: { password: hash } });
                return res.send({ "message": "password updated successfully" });
            }
            else {
                next((0, http_errors_1.default)(404, 'donor account not present'));
            }
        }
        else {
            next((0, http_errors_1.default)(422, 'password is incorrect'));
        }
    }
    else if (req.role == config_2.Roles.ADMIN || req.role == config_2.Roles.SUPER_ADMIN) {
        const admin = yield prisma_init_1.default.user.findUnique({ where: { id: req.user_id } });
        const isMatch = yield (0, password_verify_1.comparePassword)(req.body.password, admin.password);
        if (isMatch) {
            if (admin) {
                yield prisma_init_1.default.user.update({ where: { id: req.user_id }, data: { password: hash } });
                return res.send({ "message": "password updated successfully" });
            }
            else {
                next((0, http_errors_1.default)(404, 'admin account not present'));
            }
        }
        else {
            next((0, http_errors_1.default)(422, 'password is incorrect'));
        }
    }
    next((0, http_errors_1.default)(422, 'incorrect role'));
});
exports.default = { login, signup, verify_otp, forgot_password, reset_password, change_password };
