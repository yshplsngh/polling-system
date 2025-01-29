import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'pollingClientId',
    brokers: ['localhost:9092'],
});
export default kafka;
