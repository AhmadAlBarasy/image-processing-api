import express, { Router } from 'express';
import uploadFile from '../middlewares/fileUpload';
import errorController from '../controllers/errorController';
import { imageUploadedSuccessfully, listAllFiles, imageCropController } from '../controllers/apiController';

const apiRouter: Router = express.Router();

apiRouter.route('/upload').post(uploadFile, imageUploadedSuccessfully);
apiRouter.route('/crop').post(imageCropController);
apiRouter.route('/').get(listAllFiles);


apiRouter.use(errorController);

export default apiRouter;