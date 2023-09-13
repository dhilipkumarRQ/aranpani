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
const config_1 = require("../config");
const stripe = require('stripe')(config_1.STRIPE_SECRET_KEY);
const paymentUtils_1 = __importDefault(require("../utils/payments/paymentUtils"));
const prisma_init_1 = __importDefault(require("../utils/prisma_init"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const crypto_1 = __importDefault(require("crypto"));
const getPaymentMode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("to be implemented");
    }
    catch (error) {
        next(error);
    }
});
const getAllPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
const getSinglePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
const getPaymentLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listOfDonor = yield paymentUtils_1.default.getListOfDonor(req.user_id);
        const payment = yield prisma_init_1.default.payment.findFirst({
            where: { donor_id: Number(req.user_id) },
            orderBy: { created_at: 'desc' }
        });
        if (payment) {
            const PAYLOAD = {
                payment_type: 'stripe',
                payment_id: payment === null || payment === void 0 ? void 0 : payment.id,
                user_id: req.user_id,
                role: req.role
            };
            const paymentToken = jsonwebtoken_1.default.sign(PAYLOAD, config_1.SECRET_KEY, { expiresIn: '1 days', });
            const session = yield stripe.checkout.sessions.create({
                mode: 'payment',
                line_items: listOfDonor.map((donor) => {
                    return {
                        price_data: {
                            currency: "inr",
                            product_data: { name: donor.name, },
                            unit_amount: donor.payment_amount
                        },
                        quantity: 1
                    };
                }),
                success_url: `${config_1.MY_DOMAIN}?token=${paymentToken}&checkout-session-id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${config_1.MY_DOMAIN}/cancel.html`,
                metadata: { userId: req.user_id, role: 'donor' },
            });
            res.json({ url: session.url });
        }
        else {
            next((0, http_errors_1.default)(404, 'payment entry not found'));
        }
    }
    catch (error) {
        next(error);
    }
});
const verifyPaymentAndUpdateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query['token'];
        const decoded = jsonwebtoken_1.default.verify(String(token), config_1.SECRET_KEY);
        const session = req.query['checkout-session-id'];
        const payment = yield prisma_init_1.default.payment.update({
            where: { id: Number(decoded.payment_id) },
            data: {
                payment_session_id: session,
                payment_mode: config_1.PAYMENT_MODE.STRIPE
            }
        });
        res.json(payment);
    }
    catch (error) {
        next(error);
    }
});
function verifyWebhookSignature(payload, signatureHeader) {
    const signature = signatureHeader.split('t=')[1]; // Extract the timestamped signature
    const timestamp = signatureHeader.split(',')[0]; // Extract the timestamp
    const timestampBuffer = Buffer.from(timestamp, 'utf-8');
    const payloadBuffer = Buffer.from(payload, 'utf-8');
    const secretBuffer = Buffer.from(String(config_1.STRIPE_WEBHOOK_SECRET), 'utf-8');
    // Concatenate the timestamp and payload
    const concatenatedBuffer = Buffer.concat([timestampBuffer, payloadBuffer]);
    // Compute the expected signature
    const expectedSignature = crypto_1.default
        .createHmac('sha256', secretBuffer)
        .update(concatenatedBuffer)
        .digest('hex');
    return expectedSignature === signature;
}
const webhookHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const sig = req.headers['stripe-signature'];
    const event = req.body;
    // console.log(event)
    // res.send("asdfsadfsdfsdfsd")
    try {
        // const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        switch (event.type) {
            case 'checkout.session.completed':
                const chekoutCompleted = event.data.object;
                console.log('success....');
                console.log(`event type ${event.type}`);
                break;
            case 'checkout.session.expired':
                const chekoutExpired = event.data.object;
                console.log('expired....');
                console.log(`event type ${event.type}`);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ "message": "webhook recieved!" });
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.default = { getPaymentMode, getAllPayment, getSinglePayment, getPaymentLink, verifyPaymentAndUpdateStatus, webhookHandler };
