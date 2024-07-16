import { Request, Response } from 'express';
import APIError from '../utils/APIError';

const errorController: Function = (err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof APIError)
        return sendAPIError(err, req, res, next);
    res.status(500).json({
        status: 'error',
        error: err.message,
    });
};

const sendAPIError: Function = (err: APIError, req: Request, res: Response, next: Function) => {
    res.status(err.statusCode).json({
        status: 'fail',
        error: err.message,
    });
};

export default errorController;