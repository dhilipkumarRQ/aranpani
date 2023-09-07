"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const authzMiddleware_1 = require("../middleware/authzMiddleware");
const controllers_1 = __importDefault(require("../controllers"));
const router = express_1.default.Router();
router.get('/mode', [authMiddleware_1.default], controllers_1.default.paymentController.getPaymentMode);
router.get('/donor/:id', [authMiddleware_1.default], controllers_1.default.paymentController.getSinglePayment);
router.get('/donor', [authMiddleware_1.default], controllers_1.default.paymentController.getAllPayment);
router.post('/stipe-payment-link', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep], controllers_1.default.paymentController.getPaymentLink);
router.post('/verify', [authMiddleware_1.default, authzMiddleware_1.isDonorAndAreaRep], controllers_1.default.paymentController.verifyPaymentAndUpdateStatus);
exports.default = router;
