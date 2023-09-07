"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../config");
exports.s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: String(config_1.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(config_1.AWS_SECRET_ACCESS_KEY),
    },
    region: String(config_1.S3_REGION)
});
