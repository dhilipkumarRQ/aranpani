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
const prisma_init_1 = __importDefault(require("../utils/prisma_init"));
const subscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id } = req.params;
        const project = yield prisma_init_1.default.project.update({
            where: { id: Number(project_id) },
            data: { donors: { connect: { id: Number(req.user_id) } } }
        });
        res.send({ "message": `you have subscribed the ${project.temple_name} temple` });
    }
    catch (error) {
        next(error);
    }
});
const unsubscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id } = req.params;
        const project = yield prisma_init_1.default.project.update({
            where: { id: Number(project_id) },
            data: { donors: { disconnect: { id: Number(req.user_id) } } }
        });
        res.send({ "message": `you have un subscribed the ${project.temple_name} temple` });
    }
    catch (error) {
        next(error);
    }
});
exports.default = { subscribe, unsubscribe };
