import { Consumer } from 'kafkajs';
import kafkaConf from './kafka.config'

class KafkaConsumer {
    private consumer: Consumer;
    private isConnected: boolean;

    constructor(){
        this.consumer = kafkaConf.consumer({ groupId: 'poll-votes' });
        this.isConnected = false;
    }

    async connect():Promise<void>{
        try{
            await this.consumer.connect();
            this.isConnected = true;
            console.log("Kafka consumer connected");

            await this.consumer.subscribe({topic:'poll-votes', fromBeginning:true});

            await this.consumer.run({
                eachMessage: async ({topic, partition, message}) => {
                    console.log({
                        topic,
                        partition,
                        offset: message.offset,
                        value: message?.value?.toString(),
                    })
                }
            });
        }catch(error:any){
            console.error("Failed to connect to Kafka consumer",error);
            throw error;
        }
    }
    async disconnect() {
        try {
          await this.consumer.disconnect();
          this.isConnected = false;
          console.log("Kafka consumer disconnected");
        } catch (error) {
            console.error('Failed to disconnect consumer:', error);
            throw error;
        }
    }
}

export default new KafkaConsumer();