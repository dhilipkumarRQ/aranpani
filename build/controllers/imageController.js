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
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const awsS3Init_1 = require("../utils/awsS3Init");
const config_1 = require("../config");
const prisma_init_1 = __importDefault(require("../utils/prisma_init"));
const http_errors_1 = __importDefault(require("http-errors"));
const uploadImage = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: awsS3Init_1.s3Client,
        bucket: String(config_1.S3_BUCKET),
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const { id } = req.params;
            const extension = file.originalname.split('.').pop();
            const image_id = Date.now();
            let filepath = `/project/${id}/photo/image-${image_id}.${extension}`;
            cb(null, filepath);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
});
const uploadImageToS3 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { attachment_from } = req.body;
        const imagepath = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : "";
        if (Object.values(config_1.AttachmentFrom).indexOf(attachment_from) > -1) {
            const attachment = yield prisma_init_1.default.attachment.create({ data: { attachment_type: 'image', attachment_type_id: Number(id), attachment_path: imagepath } });
            if (attachment_from == config_1.AttachmentFrom.project) {
                yield prisma_init_1.default.project.update({
                    where: { id: Number(id) },
                    data: {
                        attachments: {
                            connect: { id: attachment.id }
                        }
                    }
                });
            }
            else {
                yield prisma_init_1.default.projectActivity.update({
                    where: { id: Number(id) },
                    data: {
                        attachments: {
                            connect: { id: attachment.id }
                        }
                    }
                });
            }
            res.json(attachment);
        }
        else {
            next((0, http_errors_1.default)(422, 'unable to process the request'));
        }
    }
    catch (error) {
        next(error);
    }
});
const getProjectImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const attachment = yield prisma_init_1.default.project.findFirst({
            where: { id: Number(id) },
            select: {
                attachments: {
                    where: {
                        attachment_type: 'image'
                    }
                }
            }
        });
        res.json(attachment);
    }
    catch (error) {
        next(error);
    }
});
const getProjectAttachment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const attachment = yield prisma_init_1.default.project.findFirst({
            where: { id: Number(id) },
            select: {
                attachments: {
                    where: {
                        attachment_type: 'file'
                    }
                }
            }
        });
        res.json(attachment);
    }
    catch (error) {
        next(error);
    }
});
exports.default = { uploadImageToS3, getProjectImage, uploadImage, getProjectAttachment };
