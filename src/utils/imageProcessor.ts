import APIError from "./APIError";
import path from 'path';
import sharp from "sharp";


const validateCropDimensions = (imageWidth: number, imageHeight: number, width: number, height: number, left: number, top: number): boolean => {
    if (width <= 0 || height <= 0 || left < 0 || top < 0)
        return false;
    if (left + width > imageWidth || top + height > imageHeight)
        return false;
    return true;
};

const validateResizeDimensions = (width: number, height: number): boolean => {
    if (width <= 0 || width > 10000 || height <= 0 || height > 10000) //preventing invalid dimensions and setting a limit for image sizes to limit resources usage. 
        return false;
    return true;
};

const cropImage = async (imagePath: string, userWidth: number, userHeight: number, left: number, top: number, newName: string): Promise<void> => {
    const { width, height } = await sharp(imagePath).metadata();
    if (! width || ! height)
        throw new APIError('Error getting image metadata.', 500);
    const validDimensions = validateCropDimensions(width, height, userWidth, userHeight, left, top);
    if (! validDimensions)
        throw new APIError('Invalid crop dimensions.', 400);
    await sharp(imagePath).extract({ width: userWidth, height: userHeight, left, top }).toFile(path.join('./public', newName));
};

const resizeImage = async (imagePath: string, width: number, height: number, newName: string, respectAspectRatio: boolean) => {
    let newFilePath = path.join('./public', newName);
    const validDimensions = validateResizeDimensions(width, height);
    if (! validDimensions)
        throw new APIError('Invalid resize dimensions.', 400);
    if (respectAspectRatio){
        await sharp(imagePath).resize({ width, height, fit: sharp.fit.inside, withoutEnlargement: false }).toFile(newFilePath);
        const { width: newWidth, height: newHeight } = await sharp(newFilePath).metadata();
        return { newWidth, newHeight };
    }
    await sharp(imagePath).resize({width, height, fit: sharp.fit.fill}).toFile(newFilePath);
    const { width: newWidth, height: newHeight } = await sharp(newFilePath).metadata();
    return { newWidth, newHeight };
};

const blurImage = async (imagePath: string, newName: string, sigma: number) => {
    if (sigma < 0.3 || sigma > 100) // limit of 300 to limit resource usage.
        throw new APIError('Invalid sigma value', 400);
    await sharp(imagePath).blur(sigma).toFile(path.join('./public', newName));
};

export { cropImage, resizeImage, blurImage };