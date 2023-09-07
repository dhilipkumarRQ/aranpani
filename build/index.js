"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan = require('morgan');
const http_errors_1 = __importDefault(require("http-errors"));
const index_1 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/v1', index_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, 'route does not exists'));
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}...`);
});
