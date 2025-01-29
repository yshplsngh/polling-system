import { kafkaConsumer1, kafkaConsumer2, kafkaConsumer3 } from './consumer';
import kafkaProducer from './producer';
import kafkaAdmin from './admin';

export default async function setupKafka(){
    try{
        await kafkaAdmin.createTopic();
        await kafkaConsumer1.connect();
        await kafkaConsumer2.connect();
        await kafkaConsumer3.connect();
        await kafkaProducer.connect();
    }catch(error:any){
        console.error("Failed to setup Kafka",error);
        throw error;
    }
}