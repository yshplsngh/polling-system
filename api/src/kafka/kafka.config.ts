import { Kafka } from 'kafkajs';
import { KafkaConfig } from './kafka.type';

const kafkaConfig: KafkaConfig = {
  clientId: 'polling-app',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
};

const kafka = new Kafka(kafkaConfig);
export default kafka;