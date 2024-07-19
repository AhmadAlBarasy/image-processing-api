import { Request, Response, NextFunction } from "express";
import APIError from "../utils/APIError";

const errorController = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof APIError) return sendAPIError(err, req, res);
	res.status(500).json({
		status: "error",
		error: err.message,
	});
};

const sendAPIError = (err: APIError, req: Request, res: Response) => {
	res.status(err.statusCode).json({
		status: "fail",
		error: err.message,
	});
};

export default errorController;
