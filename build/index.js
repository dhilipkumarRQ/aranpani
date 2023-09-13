"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan = require('morgan');
const http_errors_1 = __importDefault(require("http-errors"));
const index_1 = __importDefault(require("./routes/index"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.get('/', (req, res) => { res.send({ "message": "aranpani project working......." }); });
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
var server = app.listen(config_1.PORT, () => {
    console.log(`server running on port ${config_1.PORT}...`);
});
exports.default = server;
