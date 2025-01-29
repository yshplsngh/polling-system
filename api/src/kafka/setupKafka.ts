import kafkaConsumer from './consumer';
import kafkaProducer from './producer';
import kafkaAdmin from './admin';

export default async function setupKafka(){
    try{
        await kafkaAdmin.createTopic();
        await kafkaConsumer.connect();
        await kafkaProducer.connect();
    }catch(error:any){
        console.error("Failed to setup Kafka",error);
        throw error;
    }
}