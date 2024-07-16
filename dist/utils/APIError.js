"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
;
exports.default = APIError;
