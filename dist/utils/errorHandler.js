"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
};
exports.default = errorHandler;
// const errorHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
//     try {
//         fn(req, res, next);
//     } catch (err) {
//         next(err);
//     }
// };
