import path from "path";
import { readdirSync, existsSync, unlinkSync } from "fs";
import errorHandler from "../utils/errorHandler";
import APIError from "../utils/APIError";
import isValidFileName from "../utils/fileNameValidator";
import { cropImage, resizeImage, blurImage } from "../utils/imageProcessor";
import { Request, Response, NextFunction } from "express";

const listAllFiles = (req: Request, res: Response) => {
	// lists all of the files in the "public" directory.
	const files = readdirSync("./public", { recursive: true });
	let emptyDir;
	if (files.length === 0) emptyDir = "No files found.";
	res.status(200).json({
		status: "success",
		files: emptyDir || files,
	});
};

const imageUploadedSuccessfully = (req: Request, res: Response) => {
	// send a response that indicates successful image upload.
	res.status(201).json({
		status: "success",
		message: `${req.file?.filename} uploaded successfully`,
	});
};

const imageCropController = errorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// resizes an image that exists on the server and returns a JSON response containing the new dimensions.
		const { width, height, left, top, fileName, newName } = req.body;
		if (!isValidFileName(fileName) || !isValidFileName(newName))
			return next(new APIError("Invalid file name.", 400));
		const imagePath: string = path.join("./public", fileName);
		if (!existsSync(imagePath))
			return next(new APIError("Image not found.", 404));
		await cropImage(imagePath, width, height, left, top, newName);
		res.status(200).json({
			status: "success",
			newDimensions: {
				width,
				height,
			},
			outputImageName: `${newName}`,
		});
	},
);

const imageResizeController = errorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// resizes an image that exists on the server and returns a JSON response containing the new dimensions.
		const { width, height, fileName, newName, respectAspectRatio } =
			req.body;
		if (!isValidFileName(fileName) || !isValidFileName(newName))
			return next(new APIError("Invalid file name.", 400));
		const imagePath: string = path.join("./public", fileName);
		if (!existsSync(imagePath))
			return next(new APIError("Image not found.", 404));
		const { newWidth, newHeight } = await resizeImage(
			imagePath,
			width,
			height,
			newName,
			respectAspectRatio,
		);
		res.status(200).json({
			status: "success",
			newDimensions: {
				width: newWidth,
				height: newHeight,
			},
			outputImageName: `${newName}`,
		});
	},
);

const imageBlurController = errorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		// blurs an image that exists on the server and returns a JSON response of the status.
		const { fileName, newName, sigma } = req.body;
		if (!isValidFileName(fileName) || !isValidFileName(newName))
			return next(new APIError("Invalid file name.", 400));
		const imagePath: string = path.join("./public", fileName);
		if (!existsSync(imagePath))
			return next(new APIError("Image not found.", 404));
		await blurImage(imagePath, newName, sigma);
		res.status(200).json({
			status: "success",
			outputImageName: `${newName}`,
		});
	},
);

const downloadImageController = errorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const fileName: any = req.query.fileName;
		if (!fileName)
			return next(
				new APIError(
					"Please provide a file name as a query parameter.",
					400,
				),
			);
		if (!isValidFileName(fileName))
			return next(new APIError("Invalid file name.", 400));
		const imagePath: string = path.join("./public", fileName);
		if (!existsSync(imagePath))
			return next(new APIError("Image not found.", 404));
		res.status(200).download(imagePath);
	},
);

const deleteImageController = errorHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const fileName: any = req.query.fileName;
		if (!fileName)
			return next(
				new APIError(
					"Please provide a file name as a query parameter.",
					400,
				),
			);
		if (!isValidFileName(fileName))
			return next(new APIError("Invalid file name.", 400));
		const imagePath: string = path.join("./public", fileName);
		if (!existsSync(imagePath))
			return next(new APIError("Image not found.", 404));
		unlinkSync(imagePath);
		res.status(204).json();
	},
);

const methodNotSupported = (req: Request, res: Response) => {
	// sends a 405 response code that indicates that the method is not supported.
	res.status(405).json({
		status: "fail",
		message: `${req.method} not supported for this endpoint`,
	});
};

export {
	imageUploadedSuccessfully,
	listAllFiles,
	imageCropController,
	imageResizeController,
	downloadImageController,
	deleteImageController,
	imageBlurController,
	methodNotSupported,
};
