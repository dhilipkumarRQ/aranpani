"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthController_1 = __importDefault(require("../controllers/userAuthController"));
const validatorMiddleware_1 = __importDefault(require("../middleware/validatorMiddleware"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authzMiddleware_1 = require("../middleware/authzMiddleware");
const validators_1 = __importDefault(require("../validators"));
const router = express_1.default.Router();
router.post('/login', (0, validatorMiddleware_1.default)(validators_1.default.authValidator.loginSchema), userAuthController_1.default.login);
router.post('/signup', (0, validatorMiddleware_1.default)(validators_1.default.authValidator.signupSchema), userAuthController_1.default.signup);
router.post('/forgot-password', userAuthController_1.default.forgot_password);
router.post('/verify-otp', [authMiddleware_1.default], userAuthController_1.default.verify_otp);
router.post('/reset-password', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep], (0, validatorMiddleware_1.default)(validators_1.default.authValidator.resetPasswordSchema), userAuthController_1.default.reset_password);
router.post('/change-password', [authMiddleware_1.default], (0, validatorMiddleware_1.default)(validators_1.default.authValidator.changePasswordSchema), userAuthController_1.default.change_password);
exports.default = router;
