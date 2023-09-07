"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAuthController_1 = __importDefault(require("./userAuthController"));
const adminController_1 = __importDefault(require("./adminController"));
const donorController_1 = __importDefault(require("./donorController"));
const groupController_1 = __importDefault(require("./groupController"));
const projectController_1 = __importDefault(require("./projectController"));
const subscriptionController_1 = __importDefault(require("./subscriptionController"));
const paymentController_1 = __importDefault(require("./paymentController"));
const imageController_1 = __importDefault(require("./imageController"));
exports.default = { userAuthController: userAuthController_1.default, adminController: adminController_1.default, donorController: donorController_1.default, groupController: groupController_1.default, projectController: projectController_1.default, subscriptionController: subscriptionController_1.default, paymentController: paymentController_1.default, imageController: imageController_1.default };
