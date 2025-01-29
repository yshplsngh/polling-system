export interface Vote {
    pollId: string;
    optionId: string;
    userId: string;
    timestamp: string;
}

export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    retry: {
        initialRetryTime: number;
        retries: number;
    };
}