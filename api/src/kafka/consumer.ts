import { Consumer } from 'kafkajs';
import kafkaConf from './kafka.config'

class KafkaConsumer {
    private consumer: Consumer;

    constructor(){
        this.consumer = kafkaConf.consumer({ groupId: 'polling-app'});
    }

    async connect(){
        try{
            await this.consumer.connect();
            console.log("consumer connected ✅");
            await this.consumer.subscribe({topic:"polling-topic", fromBeginning:true});
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
          console.log("consumer disconnected ❌");
        } catch (error) {
            console.log('Failed to disconnect consumer:', error);
            throw error;
        }
    }
}

export default new KafkaConsumer();