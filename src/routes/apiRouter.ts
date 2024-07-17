import express, { Router } from 'express';
import uploadFile from '../middlewares/fileUpload';
import errorController from '../controllers/errorController';
import { imageUploadedSuccessfully, 
        listAllFiles, 
        imageCropController, 
        imageResizeController, 
        downloadImage,
        deleteImage,
        imageBlurController,
        methodNotSupported } from '../controllers/apiController';

const apiRouter: Router = express.Router();

apiRouter.route('/upload').post(uploadFile, imageUploadedSuccessfully);
apiRouter.route('/crop').post(imageCropController);
apiRouter.route('/resize').post(imageResizeController);
apiRouter.route('/blur').post(imageBlurController);
apiRouter.route('/download').get(downloadImage);
apiRouter.route('/delete').delete(deleteImage);
apiRouter.route('/').get(listAllFiles);

apiRouter.route('*').all(methodNotSupported);


apiRouter.use(errorController);

export default apiRouter;