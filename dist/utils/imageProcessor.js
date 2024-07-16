"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cropImage = void 0;
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
