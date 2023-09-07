"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const donor_1 = __importDefault(require("./donor"));
const group_1 = __importDefault(require("./group"));
const project_1 = __importDefault(require("./project"));
exports.default = { authValidator: auth_1.default, donorValidator: donor_1.default, groupValidator: group_1.default, projectValidator: project_1.default };
