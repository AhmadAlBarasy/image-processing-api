"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodNotSupported = exports.imageBlurController = exports.deleteImage = exports.downloadImage = exports.imageResizeController = exports.imageCropController = exports.listAllFiles = exports.imageUploadedSuccessfully = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const fileNameValidator_1 = __importDefault(require("../utils/fileNameValidator"));
const imageProcessor_1 = require("../utils/imageProcessor");
const joi_1 = __importDefault(require("joi"));
const methodNotSupported = (req, res) => {
    res.status(405).json({
        status: 'fail',
        message: `${req.method} not supported for this endpoint`
    });
};
exports.methodNotSupported = methodNotSupported;
const listAllFiles = (req, res) => {
    let emptyDir;
    const files = (0, fs_1.readdirSync)('./public', { recursive: true });
    if (files.length === 0)
        emptyDir = 'No files found.';
    res.status(200).json({
        status: 'success',
        files: emptyDir || files,
    });
};
exports.listAllFiles = listAllFiles;
const imageUploadedSuccessfully = (req, res) => {
    res.status(201).json({
        status: 'success',
        message: `${req.file?.filename} uploaded successfully`
    });
};
exports.imageUploadedSuccessfully = imageUploadedSuccessfully;
const imageCropController = (0, errorHandler_1.default)(async (req, res, next) => {
    const schema = joi_1.default.object({
        width: joi_1.default.number().required(),
        height: joi_1.default.number().required(),
        left: joi_1.default.number().required(),
        top: joi_1.default.number().required(),
        fileName: joi_1.default.string().required(),
        newName: joi_1.default.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return next(new APIError_1.default(`Missing data needed for image cropping, check API documentation for full list of requirements.`, 400));
    const { width, height, left, top, fileName, newName } = req.body;
    if (!(0, fileNameValidator_1.default)(fileName) || !(0, fileNameValidator_1.default)(newName))
        return next(new APIError_1.default('Invalid file name.', 400));
    const imagePath = path_1.default.join('./public', fileName);
    if (!(0, fs_1.existsSync)(imagePath))
        return next(new APIError_1.default('Image not found.', 404));
    await (0, imageProcessor_1.cropImage)(imagePath, width, height, left, top, newName);
    res.status(200).json({
        status: 'sucess',
        newDimensions: {
            width,
            height
        },
        outputImageName: `${newName}`
    });
});
exports.imageCropController = imageCropController;
const imageResizeController = (0, errorHandler_1.default)(async (req, res, next) => {
    const schema = joi_1.default.object({
        width: joi_1.default.number().required(),
        height: joi_1.default.number().required(),
        fileName: joi_1.default.string().required(),
        newName: joi_1.default.string().required(),
        respectAspectRatio: joi_1.default.boolean().required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return next(new APIError_1.default(`Missing data needed for image resizing, check API documentation for full list of requirements.`, 400));
    const { width, height, fileName, newName, respectAspectRatio } = req.body;
    if (!(0, fileNameValidator_1.default)(fileName) || !(0, fileNameValidator_1.default)(newName))
        return next(new APIError_1.default('Invalid file name.', 400));
    const imagePath = path_1.default.join('./public', fileName);
    if (!(0, fs_1.existsSync)(imagePath))
        return next(new APIError_1.default('Image not found.', 404));
    await (0, imageProcessor_1.resizeImage)(imagePath, width, height, newName, respectAspectRatio);
    res.status(200).json({
        status: 'sucess',
        newDimensions: {
            width,
            height
        },
        outputImageName: `${newName}`
    });
});
exports.imageResizeController = imageResizeController;
const imageBlurController = (0, errorHandler_1.default)(async (req, res, next) => {
    const schema = joi_1.default.object({
        fileName: joi_1.default.string().required(),
        newName: joi_1.default.string().required(),
        sigma: joi_1.default.number().required()
    });
    const { error } = schema.validate(req.body);
    if (error)
        return next(new APIError_1.default(`Missing data needed for image blurring, check API documentation for full list of requirements.`, 400));
    const { fileName, newName, sigma } = req.body;
    if (!(0, fileNameValidator_1.default)(fileName) || !(0, fileNameValidator_1.default)(newName))
        return next(new APIError_1.default('Invalid file name.', 400));
    const imagePath = path_1.default.join('./public', fileName);
    if (!(0, fs_1.existsSync)(imagePath))
        return next(new APIError_1.default('Image not found.', 404));
    await (0, imageProcessor_1.blurImage)(imagePath, newName, sigma);
    res.status(200).json({
        status: 'sucess',
        outputImageName: `${newName}`
    });
});
exports.imageBlurController = imageBlurController;
const downloadImage = (0, errorHandler_1.default)(async (req, res, next) => {
    const { fileName } = req.query;
    if (!fileName)
        return next(new APIError_1.default('Please provide a file name as a query parameter.', 400));
    if (!(0, fileNameValidator_1.default)(fileName))
        return next(new APIError_1.default('Invalid file name.', 400));
    const imagePath = path_1.default.join('./public', fileName);
    if (!(0, fs_1.existsSync)(imagePath))
        return next(new APIError_1.default('Image not found.', 404));
    res.status(200).download(imagePath);
});
exports.downloadImage = downloadImage;
const deleteImage = (0, errorHandler_1.default)(async (req, res, next) => {
    const { fileName } = req.query;
    if (!fileName)
        return next(new APIError_1.default('Please provide a file name as a query parameter.', 400));
    if (!(0, fileNameValidator_1.default)(fileName))
        return next(new APIError_1.default('Invalid file name.', 400));
    const imagePath = path_1.default.join('./public', fileName);
    if (!(0, fs_1.existsSync)(imagePath))
        return next(new APIError_1.default('Image not found.', 404));
    (0, fs_1.unlinkSync)(imagePath);
    res.status(204).json();
});
exports.deleteImage = deleteImage;
