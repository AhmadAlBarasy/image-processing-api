"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blurImage = exports.resizeImage = exports.cropImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const APIError_1 = __importDefault(require("./APIError"));
const path_1 = __importDefault(require("path"));
const validateCropDimensions = (imageWidth, imageHeight, width, height, left, top) => {
    if (width <= 0 || height <= 0 || left < 0 || top < 0)
        return false;
    if (left + width > imageWidth || top + height > imageHeight)
        return false;
    return true;
};
const validateResizeDimensions = (width, height) => {
    if (width <= 0 || width > 10000 || height <= 0 || height > 10000) //preventing invalid dimensions and setting a limit for image sizes to limit resources usage. 
        return false;
    return true;
};
const cropImage = async (imagePath, userWidth, userHeight, left, top, newName) => {
    const { width, height } = await (0, sharp_1.default)(imagePath).metadata();
    if (!width || !height)
        throw new APIError_1.default('Error getting image metadata.', 500);
    const validDimensions = validateCropDimensions(width, height, userWidth, userHeight, left, top);
    if (!validDimensions)
        throw new APIError_1.default('Invalid crop dimensions.', 400);
    await (0, sharp_1.default)(imagePath).extract({ width: userWidth, height: userHeight, left, top }).toFile(path_1.default.join('./public', newName));
};
exports.cropImage = cropImage;
const resizeImage = async (imagePath, width, height, newName, respectAspectRatio) => {
    const validDimensions = validateResizeDimensions(width, height);
    if (!validDimensions)
        throw new APIError_1.default('Invalid resize dimensions.', 400);
    if (respectAspectRatio) {
        await (0, sharp_1.default)(imagePath).resize({ width, height, fit: sharp_1.default.fit.inside, background: { r: 255, g: 255, b: 255, alpha: 1 } }).toFile(path_1.default.join('./public', newName));
        return;
    }
    await (0, sharp_1.default)(imagePath).resize({ width, height, fit: sharp_1.default.fit.fill }).toFile(path_1.default.join('./public', newName));
};
exports.resizeImage = resizeImage;
const blurImage = async (imagePath, newName, sigma) => {
    if (sigma < 0.3 || sigma > 100) // limit of 300 to limit resource usage.
        throw new APIError_1.default('Invalid sigma value', 400);
    await (0, sharp_1.default)(imagePath).blur(sigma).toFile(path_1.default.join('./public', newName));
};
exports.blurImage = blurImage;
