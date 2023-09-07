"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDonorAndAreaRep = exports.isSuperAdminAndAdmin = exports.isSuperAdmin = exports.isDonor = exports.isAreaRep = exports.isAdmin = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("../config");
const http_errors_1 = __importDefault(require("http-errors"));
const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
    if (decoded.role == config_2.Roles.ADMIN) {
        next();
    }
    else {
        next(http_errors_1.default.Forbidden('access restricted'));
    }
};
exports.isAdmin = isAdmin;
const isAreaRep = (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
    if (decoded.role == config_2.Roles.AREA_REP) {
        next();
    }
    else {
        next(http_errors_1.default.Forbidden('access restricted'));
    }
};
exports.isAreaRep = isAreaRep;
const isDonor = (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
    if (decoded.role == config_2.Roles.DONOR) {
        next();
    }
    else {
        next(http_errors_1.default.Forbidden('access restricted'));
    }
};
exports.isDonor = isDonor;
const isSuperAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
    if (decoded.role == config_2.Roles.SUPER_ADMIN) {
        next();
    }
    else {
        next(http_errors_1.default.Forbidden('access restricted'));
    }
};
exports.isSuperAdmin = isSuperAdmin;
const isSuperAdminAndAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
    if (decoded.role == config_2.Roles.SUPER_ADMIN || decoded.role == config_2.Roles.ADMIN) {
        next();
    }
    else {
        next(http_errors_1.default.Forbidden('access restricted'));
    }
};
exports.isSuperAdminAndAdmin = isSuperAdminAndAdmin;
const isDonorAndAreaRep = (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
    if (decoded.role == config_2.Roles.DONOR || decoded.role == config_2.Roles.AREA_REP) {
        next();
    }
    else {
        next(http_errors_1.default.Forbidden('access restricted'));
    }
};
exports.isDonorAndAreaRep = isDonorAndAreaRep;
