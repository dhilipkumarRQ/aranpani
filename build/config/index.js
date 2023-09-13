"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageExtensions = exports.fileExtensions = exports.MY_DOMAIN = exports.STRIPE_SECRET_KEY = exports.AttachmentFrom = exports.AttachmentType = exports.PAYMENT_MODE = exports.PROJECT_STATUS_ORDER = exports.PROJECT_STATUS = exports.NODE_ENV = exports.DATABASE_URL = exports.PORT = exports.STRIPE_WEBHOOK_SECRET = exports.S3_REGION = exports.S3_BUCKET = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.MAX_REGISTER_NUMBER = exports.DEFAULT_PASSWORD = exports.AREA_REP = exports.DONOR = exports.SUPER_ADMIN = exports.ADMIN = exports.Roles = exports.SECRET_KEY = exports.OTP = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = String(process.env.NODE_ENV) == 'development' ? '.env' : '.test.env';
let path = `${__dirname}/../../${envFile}`;
dotenv_1.default.config({ path: path });
exports.OTP = 1111;
exports.SECRET_KEY = 'jwt_aranpani secret';
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "admin";
    Roles["SUPER_ADMIN"] = "super_admin";
    Roles["DONOR"] = "donor";
    Roles["AREA_REP"] = "area_rep";
})(Roles || (exports.Roles = Roles = {}));
exports.ADMIN = 'admin';
exports.SUPER_ADMIN = 'super_admin';
exports.DONOR = 'donor';
exports.AREA_REP = 'area_rep';
exports.DEFAULT_PASSWORD = 'pass1234';
exports.MAX_REGISTER_NUMBER = 10000000;
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.S3_BUCKET = process.env.S3_BUCKET;
exports.S3_REGION = process.env.S3_REGION;
exports.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
exports.PORT = process.env.PORT;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.NODE_ENV = process.env.NODE_ENV;
exports.PROJECT_STATUS = {
    PROPOSED: 'proposed',
    PLANNED: 'planned',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    SCRAPPED: 'scrapped'
};
exports.PROJECT_STATUS_ORDER = [exports.PROJECT_STATUS.PROPOSED, exports.PROJECT_STATUS.PLANNED, exports.PROJECT_STATUS.ACTIVE, exports.PROJECT_STATUS.COMPLETED];
exports.PAYMENT_MODE = {
    GPAY: 'gpay',
    PAYTM: 'paytm',
    PHONEPE: 'phonepe',
    AMAZON_PAY: 'amazonpay',
    OFFLINE: 'offline',
    STRIPE: 'stripe'
};
exports.AttachmentType = {
    file: 'file',
    image: 'image'
};
exports.AttachmentFrom = {
    project: 'project',
    activity: 'activity'
};
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
exports.MY_DOMAIN = 'http://localhost:8000/payment';
exports.fileExtensions = [".jpeg", ".jpg", ".png"];
exports.imageExtensions = [".pdf", ".doc"];
