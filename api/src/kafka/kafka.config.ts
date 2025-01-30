import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'pollingClientId',
    brokers: ['kafka:9092'],
});
export default kafka;
