import { NextFunction, Request, Response } from 'express';

const errorHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
};


export default errorHandler;