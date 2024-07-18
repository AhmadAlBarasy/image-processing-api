import morgan from 'morgan';
import express,{ Request, Response } from 'express';
import apiRouter from './routes/apiRouter';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);

app.route('*').all((req: Request, res: Response) => res.status(404).json({ status: 'fail', message: 'endpoint not implemented.'}));

export default app;