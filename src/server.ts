import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
dotenv.config();
import apiRouter from './routes/apiRouter';
const PORT: number | string = process.env.PORT || 80;

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.use('/api', apiRouter);