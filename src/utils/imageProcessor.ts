import sharp from "sharp";
import APIError from "./APIError";
import path from 'path';

const validateCropDimensions = (imageWidth: number, imageHeight: number, width: number, height: number, left: number, top: number): boolean => {
    if (width <= 0 || height <= 0 || left < 0 || top < 0)
        return false;
    if (left + width > imageWidth || top + height > imageHeight)
        return false;
    return true;
};

const cropImage = async (imagePath: string, userWidth: number, userHeight: number, left: number, top: number, newName: string) => {
    const { width, height } = await sharp(imagePath).metadata();
    if (! width || ! height)
        throw new APIError('Error getting image metadata.', 500);
    const validDimensions = validateCropDimensions(width, height, userWidth, userHeight, left, top);
    if (! validDimensions)
        throw new APIError('Invalid crop dimensions.', 400);
    await sharp(imagePath).extract({ width: userWidth, height: userHeight, left, top }).toFile(path.join('./public', newName));
};

export { cropImage };