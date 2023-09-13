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
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
const crypto_1 = __importDefault(require("crypto"));
exports.default = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const signatureHeader = req.headers['stripe-signature'];
            const signature = signatureHeader.split('t=')[1]; // Extract the timestamped signature
            const timestamp = signatureHeader.split(',')[0]; // Extract the timestamp
            const timestampBuffer = Buffer.from(timestamp, 'utf-8');
            const payloadBuffer = Buffer.from(JSON.stringify(req.body), 'utf-8');
            const secretBuffer = Buffer.from(String(config_1.STRIPE_WEBHOOK_SECRET), 'utf-8');
            // Concatenate the timestamp and payload
            const concatenatedBuffer = Buffer.concat([timestampBuffer, payloadBuffer]);
            // Compute the expected signature
            const expectedSignature = crypto_1.default
                .createHmac('sha256', secretBuffer)
                .update(concatenatedBuffer)
                .digest('hex');
            if (expectedSignature === signature) {
                next();
            }
            else {
                return next((0, http_errors_1.default)(422, 'stripe signature verification failed'));
            }
        }
        catch (err) {
            return next(err);
        }
    });
};
