import { Admin } from 'kafkajs';
import kafkaConf from './kafka.config';

class KafkaAdmin {
    private admin:Admin;

    constructor(){
        this.admin = kafkaConf.admin();
    }

    async createTopic(){
        try{
            await this.admin.connect();
            const topic = await this.admin.listTopics();
            console.log(topic);
            if(!topic.includes("polling-topic")){
                await this.admin.createTopics({
                    topics: [{
                        topic: "polling-topic",
                        numPartitions: 3
                    }],
                });
            }
            console.log(`Topic created successfully ✅`);
        }catch(error:any){
            console.log("Failed to create topic",error);
            throw error;
        }finally {
            await this.admin.disconnect();
        }
    }
}
export default new KafkaAdmin();