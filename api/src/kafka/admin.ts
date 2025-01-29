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

            await this.admin.createTopics({
                topics: [{
                    topic: "poll-votes",
                    numPartitions: 1,
                    replicationFactor: 1
                }],
            });

            console.log(`Topic created successfully`);
        }catch(error:any){
            console.error("Failed to create topic",error);
            throw error;
        }finally {
            await this.admin.disconnect();
        }
    }
}
export default new KafkaAdmin();