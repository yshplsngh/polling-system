import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './utils/config';
import { errorHandler, uncaughtExceptionHandler } from './utils/errorHander';
import setupKafka from './kafka/setupKafka';
import kafkaConsumer from './kafka/consumer';
import kafkaProducer from './kafka/producer';
import { closePool } from './database/conPool';

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
process.on('SIGINT', async () => {
    await closePool();
    await kafkaConsumer.disconnect();
    await kafkaProducer.disconnect();
    process.exit(0);
});
process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
app.use(errorHandler);

app.listen(config.PORT, async() => {
    console.log(`Server is running on port ${config.PORT}`);
    await setupKafka();
})