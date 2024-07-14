import express, { Request, Response, Router } from 'express';
import upload from '../middlewares/fileUpload';

const apiRouter: Router = express.Router();

apiRouter.route('/').post(upload.single('photo'), (req: Request, res: Response) => {
    res.send('file uploaded successfully');
});

export default apiRouter;