import APIError from '../utils/APIError';
import isValidFileName from '../utils/fileNameValidator';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

const supportedFile: Function = (fileName: string): boolean => { // a simple function to check if the file type is supported.
    const supportedTypes: RegExp = /\.(png|jpeg)$/i;
    return supportedTypes.test(fileName);
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        if (!supportedFile(path.extname(file.originalname))) // checking for file type, if it's not supported, return an error.
            return cb(new APIError("Image type not supported", 400), '');
        if (!isValidFileName(file.originalname))
            return cb(new APIError('Invalid file name', 400), '');
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 4000000 // 4 MB limit for file size.
    }
});

const uploadFile = (req: Request, res: Response, next: NextFunction): void => {
    upload.single('image')(req, res, (err) => {
        if (err)
            return next(err);
        if (!req.file)
            return next(new APIError('no file provided', 400));
        else
            next();
    });
};

export default uploadFile;