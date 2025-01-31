import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './utils/config';
import { errorHandler, uncaughtExceptionHandler } from './utils/errorHander';
import setupKafka from './kafka/setupKafka';
import pollsRouter from './router/pollsRouter';
import http from 'http';
import websocketSetup from './websocket';

const app = express();
const server = http.createServer(app);
export const wsInstance = new websocketSetup(server);

app.use(morgan('dev'));
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);
const delay = (time: number) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

app.use('/api/v1', pollsRouter);

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
app.use(errorHandler);

server.listen(config.PORT, async () => {

    // it will delay the server start for 5 seconds to make sure kafka inside docker is ready
    // sometime api starts before kafka is ready and it will throw error
    // its a temporary solution
    // but it got the job done for now
    await delay(5000)
    await setupKafka();
    console.log(`Server connected to port ${config.PORT}`);
})