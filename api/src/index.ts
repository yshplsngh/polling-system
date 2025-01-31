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

app.use('/api/v1', pollsRouter);

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
app.use(errorHandler);

server.listen(config.PORT, async () => {
    await setupKafka();
    console.log(`Server connected to port ${config.PORT}`);
})