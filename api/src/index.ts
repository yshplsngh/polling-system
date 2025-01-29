import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './utils/config';
import { errorHandler, uncaughtExceptionHandler } from './utils/errorHander';
import setupKafka from './kafka/setupKafka';
import kafkaProducer from './kafka/producer'
import pollsRouter from './router/pollsRouter';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);

app.use('/api/v1', pollsRouter);

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
app.use(errorHandler);

app.listen(config.PORT, async () => {
    // await setupKafka();
    console.log(`Server connected to port ${config.PORT}`);
})