import { Producer } from 'kafkajs';
import kafkaConf from './kafka.config'
import { Vote } from './kafka.type';


class KafkaProducer {
    private producer: Producer;
    private isConnected: boolean;

    constructor() {
        this.producer = kafkaConf.producer();
        this.isConnected = false;
    }

    async connect(): Promise<void> {
        await this.producer.connect();
        this.isConnected = true;
        console.log("Kafka producer connected");
    } catch(error: any) {
        console.error("Failed to connect to Kafka producer", error);
    }

    async disconnect(): Promise<void> {
        await this.producer.disconnect();
        this.isConnected = false;
        console.log("Kafka producer disconnected");
    }

    async sendVote(vote: Vote): Promise<void> {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            await this.producer.send({
                topic: 'poll-votes',
                messages: [
                    {
                        key: String(vote.pollId),
                        value: JSON.stringify(vote)
                    }
                ],
            });
        } catch (error) {
            console.error('Failed to send vote:', error);
            throw error;
        }
    }
}
