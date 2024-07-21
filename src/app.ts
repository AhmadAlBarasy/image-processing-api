import morgan from "morgan";
import express, { Request, Response, Express, NextFunction } from "express";
import apiRouter from "./routes/apiRouter";
import errorController from "./controllers/errorController";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.route("*").all((req: Request, res: Response) =>
	res
		.status(404)
		.json({ status: "fail", message: "Endpoint not implemented." }),
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
	errorController(err, req, res, next),
); // error handler in case any error happened during receiving and processing the request using the body parser.

export default app;
