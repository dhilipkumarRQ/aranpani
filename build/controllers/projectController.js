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
const config_1 = require("../config");
const http_errors_1 = __importDefault(require("http-errors"));
const validators_1 = __importDefault(require("../validators"));
const addProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const register_no = Math.floor(Math.random() * (config_1.MAX_REGISTER_NUMBER + 1));
        const project = yield prisma_init_1.default.project.create({ data: Object.assign(Object.assign({}, req.body), { register_no: String(register_no) }) });
        res.send(project);
    }
    catch (error) {
        next(error);
    }
});
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("to be implemented...");
});
const getAllProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { search, limit, offset, sort, order } = req.query;
        const orderBy = { [String(sort)]: order ? 'asc' : 'desc' };
        const page = (Number(offset) / Number(limit)) + 1;
        var project;
        if (search) {
            search = String(search);
            project = yield prisma_init_1.default.project.findMany({
                where: {
                    OR: [
                        { register_no: { contains: search }, },
                        { temple_name: { contains: search } },
                        { location: { contains: search } },
                        { id: { equals: isNaN(parseInt(search)) ? undefined : Number(search) } },
                    ]
                },
                orderBy,
                skip: offset ? Number(offset) : undefined,
                take: offset ? Number(limit) : undefined
            });
        }
        else {
            project = yield prisma_init_1.default.project.findMany({
                orderBy,
                skip: offset ? Number(offset) : undefined,
                take: offset ? Number(limit) : undefined
            });
        }
        res.json({ project, "page": page ? page : 1 });
    }
    catch (error) {
        next(error);
    }
});
const getProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const donor = yield prisma_init_1.default.project.findUnique({ where: { id: Number(id) } });
        res.json(donor);
    }
    catch (error) {
        next(error);
    }
});
const changeProjectState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (Object.values(config_1.PROJECT_STATUS).includes(status) && (yield isValidStateChange(status, id))) {
            var project;
            if (status == config_1.PROJECT_STATUS.PLANNED) {
                const { error } = validators_1.default.projectValidator.plannedState.validate(req.body);
                if (error) {
                    next(error);
                    return;
                }
                const start_date = new Date(req.body.start_date);
                const end_date = new Date(req.body.end_date);
                if (start_date.getTime() < end_date.getTime()) {
                    project = yield prisma_init_1.default.project.update({
                        where: { id: Number(id) },
                        data: Object.assign(Object.assign({}, req.body), { start_date: start_date, end_date: end_date, status: status })
                    });
                    res.json(project);
                }
                else {
                    next((0, http_errors_1.default)(422, 'start date should be before end date'));
                }
            }
            project = yield prisma_init_1.default.project.update({
                where: { id: Number(id) },
                data: Object.assign({}, req.body)
            });
            res.json(project);
        }
        else {
            next((0, http_errors_1.default)(422, 'cannot process the status'));
        }
    }
    catch (error) {
        next(error);
    }
});
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const project = yield prisma_init_1.default.project.findUnique({ where: { id: Number(id) } });
        if (project) {
            yield prisma_init_1.default.project.update({ where: { id: Number(id) }, data: { status: config_1.PROJECT_STATUS.SCRAPPED, deleted_at: new Date() } });
            res.send({ "message": "project scrapped successfully" });
        }
        else {
            next((0, http_errors_1.default)(404, 'project does not exists'));
        }
    }
    catch (error) {
        next(error);
    }
});
const getAllSubscriber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id } = req.params;
        const subcribers = yield prisma_init_1.default.project.findUnique({
            where: { id: Number(project_id) },
            select: { donors: { select: { id: true, name: true, phone_number: true } } }
        });
        res.send(subcribers);
    }
    catch (error) {
        next(error);
    }
});
const isValidStateChange = (nextstate, id) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_init_1.default.project.findUnique({ where: { id: Number(id) }, select: { status: true } });
    const currentstate = (project === null || project === void 0 ? void 0 : project.status) || '';
    if (config_1.PROJECT_STATUS_ORDER.indexOf(currentstate) + 1 == config_1.PROJECT_STATUS_ORDER.indexOf(nextstate)) {
        return true;
    }
    return false;
});
const restoreProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const project = yield prisma_init_1.default.project.findUnique({ where: { id: Number(id) } });
        if (project) {
            if (project.status == config_1.PROJECT_STATUS.SCRAPPED) {
                yield prisma_init_1.default.project.update({
                    where: { id: Number(id) },
                    data: { status: config_1.PROJECT_STATUS.ACTIVE, deleted_at: null }
                });
                res.send({ "message": "project restored successfully" });
            }
            else {
                next((0, http_errors_1.default)(422, 'project is already active'));
            }
        }
        else {
            next((0, http_errors_1.default)(404, 'project does not exists'));
        }
    }
    catch (error) {
        next(error);
    }
});
const addActivity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id } = req.params;
        const activity = yield prisma_init_1.default.projectActivity.create({ data: Object.assign(Object.assign({}, req.body), { project_id: Number(project_id) }) });
        res.send(activity);
    }
    catch (error) {
        next(error);
    }
});
const getAllActivity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project_id } = req.params;
        const activity = yield prisma_init_1.default.projectActivity.findMany({ where: { project_id: Number(project_id) } });
        res.send(activity);
    }
    catch (error) {
        next(error);
    }
});
const editActivity = (req, res, next) => {
    res.send("to be implemented...");
};
exports.default = { addProject, updateProject, getAllProject, getProject, changeProjectState, deleteProject, getAllSubscriber, restoreProject, addActivity, getAllActivity, editActivity };
