import { Consumer } from 'kafkajs';
import kafkaConf from './kafka.config'

class KafkaConsumer {
    private consumer: Consumer;
    private isConnected: boolean;
    
    constructor(){
        this.consumer = kafkaConf.consumer({ groupId: 'poll-votes' });
        this.isConnected = false;
        
    }
}