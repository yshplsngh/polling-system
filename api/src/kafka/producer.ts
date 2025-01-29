import { Producer } from 'kafkajs';
import kafkaConf from './kafka.config'
import { createError } from '../utils/errorHander';

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

    async addVote(vote:{
        poll_id: number,
        option_id: number,
        timestamp: string
    }) {
        try{
            await this.producer.send({
                topic: "polling-topic",
                messages: [{
                    key: vote.poll_id.toString(),
                    value: JSON.stringify(vote)
                }]
            });
        }catch(error:any){
            console.log("Failed to send vote to Kafka",error);
            throw new createError("Failed to send vote to Kafka",500);
        }
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