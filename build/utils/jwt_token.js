"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const config_2 = require("../config");
const config_3 = require("../config");
const generateToken = (userModel, userType) => {
    var role = null;
    if (userType == config_1.Roles.ADMIN) {
        role = config_2.ADMIN;
    }
    else if (userType == config_1.Roles.SUPER_ADMIN) {
        role = config_2.SUPER_ADMIN;
    }
    else if (userType == config_1.Roles.DONOR) {
        role = config_2.DONOR;
    }
    else {
        role = config_2.AREA_REP;
    }
    const payload = {
        'user_id': userModel.id,
        'role': role,
        'iat': Date.now()
    };
    const token = jsonwebtoken_1.default.sign(payload, config_3.SECRET_KEY, { expiresIn: '1 days', });
    return token;
};
exports.generateToken = generateToken;
