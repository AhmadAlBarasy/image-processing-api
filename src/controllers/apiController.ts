import path from 'path';
import { readdirSync, existsSync, unlinkSync, stat } from 'fs';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import isValidFileName from '../utils/fileNameValidator';
import { cropImage, resizeImage, blurImage } from '../utils/imageProcessor';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const methodNotSupported = (req: Request, res: Response) => {
    res.status(405).json({
        status: 'fail',
        message: `${req.method} not supported for this endpoint`
    });
};

const listAllFiles = (req: Request, res: Response) => { // lists all of the files in the "public" directory.
    let emptyDir;
    const files = readdirSync('./public', { recursive: true });
    if (files.length === 0) emptyDir = 'No files found.';
    res.status(200).json({
        status: 'success',
        files: emptyDir || files,
    });
};

const imageUploadedSuccessfully = (req: Request, res: Response) => { // send a response that indicates successful image upload.
    res.status(201).json({
        status: 'success',
        message: `${req.file?.filename} uploaded successfully`
    });
};

const imageCropController = errorHandler(async (req: Request, res: Response, next: NextFunction) => { // crops an image that exists on the server and returns a JSON response of the status.
    const schema = Joi.object({ // create a schema that you can validate req.body using it.
        width: Joi.number().required(),
        height: Joi.number().required(),
        left: Joi.number().required(),
        top: Joi.number().required(),
        fileName: Joi.string().required(),
        newName: Joi.string().required()
    });
    const { error } =  schema.validate(req.body);
    if (error)
        return next(new APIError(`Missing data needed for image cropping, check API documentation for full list of requirements.`, 400));
    const {width, height, left, top, fileName, newName} = req.body;
    if (!isValidFileName(fileName) || !isValidFileName(newName))
        return next(new APIError('Invalid file name.', 400));
    const imagePath: string = path.join('./public', fileName);
    if (!existsSync(imagePath)) return next(new APIError('Image not found.', 404));
    await cropImage(imagePath, width, height, left, top, newName);
    res.status(200).json({
        status: 'success',
        newDimensions: {
            width,
            height
        },
        outputImageName: `${newName}`
    });
});

const imageResizeController = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({ // create a schema that you can validate req.body using it.
        width: Joi.number().required(),
        height: Joi.number().required(),
        fileName: Joi.string().required(),
        newName: Joi.string().required(),
        respectAspectRatio: Joi.boolean().required()
    });
    const { error } =  schema.validate(req.body);
    if (error)
        return next(new APIError(`Missing data needed for image resizing, check API documentation for full list of requirements.`, 400));
    const {width, height, fileName, newName, respectAspectRatio} = req.body;
    if (!isValidFileName(fileName) || !isValidFileName(newName))
        return next(new APIError('Invalid file name.', 400));
    const imagePath: string = path.join('./public', fileName);
    if (!existsSync(imagePath)) return next(new APIError('Image not found.', 404));
    const { newWidth, newHeight } = await resizeImage(imagePath, width, height, newName, respectAspectRatio);
    res.status(200).json({
        status: 'success',
        newDimensions: {
            width: newWidth,
            height: newHeight
        },
        outputImageName: `${newName}`
    });
});

const imageBlurController = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({ // create a schema that you can validate req.body using it.
        fileName: Joi.string().required(),
        newName: Joi.string().required(),
        sigma: Joi.number().required()   
    });
    const { error } =  schema.validate(req.body);
    if (error)
        return next(new APIError(`Missing data needed for image blurring, check API documentation for full list of requirements.`, 400));
    const {fileName, newName, sigma} = req.body;
    if (!isValidFileName(fileName) || !isValidFileName(newName))
        return next(new APIError('Invalid file name.', 400));
    const imagePath: string = path.join('./public', fileName);
    if (!existsSync(imagePath)) return next(new APIError('Image not found.', 404));
    await blurImage(imagePath, newName, sigma);
    res.status(200).json({
        status: 'success',
        outputImageName: `${newName}`
    });
});

const downloadImage = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fileName: any= req.query.fileName;
    if (!fileName)
        return next(new APIError('Please provide a file name as a query parameter.', 400));
    if (!isValidFileName(fileName))
        return next(new APIError('Invalid file name.', 400));
    const imagePath: string = path.join('./public', fileName);
    if (!existsSync(imagePath)) return next(new APIError('Image not found.', 404));
    res.status(200).download(imagePath);
});

const deleteImage = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fileName: any= req.query.fileName;
    if (!fileName)
        return next(new APIError('Please provide a file name as a query parameter.', 400));
    if (!isValidFileName(fileName))
        return next(new APIError('Invalid file name.', 400));
    const imagePath: string = path.join('./public', fileName);
    if (!existsSync(imagePath)) return next(new APIError('Image not found.', 404));
    unlinkSync(imagePath);
    res.status(204).json();
});


export { imageUploadedSuccessfully,
        listAllFiles,
        imageCropController,
        imageResizeController,
        downloadImage,
        deleteImage,
        imageBlurController,
        methodNotSupported };