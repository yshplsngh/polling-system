import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './utils/config';
import { errorHandler, uncaughtExceptionHandler } from './utils/errorHander';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);



// these will handle errors
process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
app.use(errorHandler);

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})