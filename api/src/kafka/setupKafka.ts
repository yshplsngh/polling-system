import kafkaConsumer from './consumer';
import kafkaProducer from './producer';

export default async function setupKafka(){
    try{
        await kafkaConsumer.connect();
        await kafkaProducer.connect();
        console.log("Kafka setup completed");
    }catch(error:any){
        console.error("Failed to setup Kafka",error);
        throw error;
    }
}