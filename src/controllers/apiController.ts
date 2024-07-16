import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import isValidFileName from '../utils/fileNameValidator';
import { cropImage } from '../utils/imageProcessor';
import path from 'path';
import { readdirSync, existsSync } from 'fs';


const listAllFiles = (req: Request, res: Response, next: NextFunction) => { // lists all of the files in the "public" directory.
    let emptyDir;
    const files = readdirSync('./public', { recursive: true });
    if (files.length === 0) emptyDir = 'No files found.';
    res.status(200).json({
        status: 'success',
        files: emptyDir || files,
    });
};

const imageUploadedSuccessfully = (req: Request, res: Response, next: NextFunction) => { // send a response that indicates successful image upload.
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
        status: 'sucess',
        newDimensions: {
            width,
            height
        },
        outputImageName: `${newName}`
    });
});

export { imageUploadedSuccessfully, listAllFiles, imageCropController };