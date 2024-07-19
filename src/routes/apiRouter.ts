import express, { Router, Request, Response, NextFunction } from "express";
import uploadFile from "../middlewares/fileUpload";
import errorController from "../controllers/errorController";
import {
	getCropSchema,
	getResizeSchema,
	getBlurSchema,
} from "../utils/joiSchemas";
import validateBody from "../middlewares/validateJsonBody";
import {
	imageUploadedSuccessfully,
	listAllFiles,
	imageCropController,
	imageResizeController,
	downloadImageController,
	deleteImageController,
	imageBlurController,
	methodNotSupported,
} from "../controllers/apiController";

const apiRouter: Router = express.Router();

apiRouter.route("/upload").post(uploadFile, imageUploadedSuccessfully);
apiRouter.route("/crop").post(validateBody(getCropSchema), imageCropController);
apiRouter
	.route("/resize")
	.post(validateBody(getResizeSchema), imageResizeController);
apiRouter.route("/blur").post(validateBody(getBlurSchema), imageBlurController);
apiRouter.route("/download").get(downloadImageController);
apiRouter.route("/delete").delete(deleteImageController);
apiRouter.route("/").get(listAllFiles);

apiRouter.route("*").all(methodNotSupported);

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) =>
	errorController(err, req, res, next),
); // to solve a random ts problem.

export default apiRouter;
