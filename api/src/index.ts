import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './utils/config';
import { errorHandler, uncaughtExceptionHandler } from './utils/errorHander';
import setupKafka from './kafka/setupKafka';
import kafkaProducer from './kafka/producer'

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);

app.get('/api/v1/polls', async (req, res) => {
    await kafkaProducer.sendVote("123");
    await kafkaProducer.sendVote("asd");
    await kafkaProducer.sendVote("123d");
    await kafkaProducer.sendVote("123sd");
    await kafkaProducer.sendVote("123ds");
    await kafkaProducer.sendVote("123dss");
    await kafkaProducer.sendVote("123dsss");
    await kafkaProducer.sendVote("123dssss");
    await kafkaProducer.sendVote("123dsssss");
    await kafkaProducer.sendVote("123dssssss");
    await kafkaProducer.sendVote("123dsssssss");
    await kafkaProducer.sendVote("123dssssssss");
    await kafkaProducer.sendVote("123dsssssssss");
    await kafkaProducer.sendVote("123dssssssssss");
    await kafkaProducer.sendVote("123dsssssssssss");
    await kafkaProducer.sendVote("123dssssssssssss");
    await kafkaProducer.sendVote("123dsssssssssssss");
    await kafkaProducer.sendVote("123dssssssssssssss");
    await kafkaProducer.sendVote("123dsssssssssssssss");
    await kafkaProducer.sendVote("123dssssssssssssssss");
    
    res.status(200).json({ message: "Vote sent successfully" });
});


process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
app.use(errorHandler);

app.listen(config.PORT, async () => {
    await setupKafka();
    console.log(`Server connected to port ${config.PORT}`);
})