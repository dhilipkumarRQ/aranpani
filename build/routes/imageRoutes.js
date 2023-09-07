"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const controllers_1 = __importDefault(require("../controllers"));
const router = express_1.default.Router();
router.post('/project/:id', authMiddleware_1.default, controllers_1.default.imageController.uploadImage.single("file"), controllers_1.default.imageController.uploadImageToS3);
exports.default = router;
