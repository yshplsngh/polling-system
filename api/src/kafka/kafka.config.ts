import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "polling-api",
    brokers:['localhost:9092'],
    retry:{
        retries:10,
        initialRetryTime: 100
    }
})
export default kafka;