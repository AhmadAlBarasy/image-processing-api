import express, { Request, Response, Router } from 'express';

const apiRouter: Router = express.Router();

apiRouter.route('/').get((req: Request, res: Response) => {
    res.send("Test");
});

export default apiRouter;