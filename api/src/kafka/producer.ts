import { Producer } from 'kafkajs';
import kafkaConf from './kafka.config'

class KafkaProducer {
    private producer: Producer;

    constructor() {
        this.producer = kafkaConf.producer();
    }

    async connect() {
        try {
            await this.producer.connect();
            console.log("producer connected ✅");
        } catch (error: any) {
            console.log("Failed to connect to Kafka producer", error);
            throw error;
        }
    }

    async sendVote(pollId: string) {
        await this.producer.send({
            topic: "polling-topic",
            messages: [{
                value: pollId
            }]
        });
    }

    async disconnect() {
        try {
            await this.producer.disconnect();
            console.log("producer disconnected ❌");
        } catch (error: any) {
            console.log("Failed to disconnect producer", error);
            throw error;
        }
    }
}

export default new KafkaProducer();