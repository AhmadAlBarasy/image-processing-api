"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = __importDefault(require("../utils/APIError"));
const errorController = (err, req, res, next) => {
    if (err instanceof APIError_1.default)
        return sendAPIError(err, req, res, next);
    res.status(500).json({
        status: 'error',
        error: err.message,
    });
};
const sendAPIError = (err, req, res, next) => {
    res.status(err.statusCode).json({
        status: 'fail',
        error: err.message,
    });
};
exports.default = errorController;
