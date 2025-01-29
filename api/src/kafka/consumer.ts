import { Consumer } from 'kafkajs';
import kafkaConf from './kafka.config'
import prisma from '../database';
import { createError } from '../utils/errorHander';

class KafkaConsumer {
    private consumer: Consumer;
    private consumerId: string;

    constructor(id: string) {
        this.consumer = kafkaConf.consumer({ groupId: `polling-app` });
        this.consumerId = id;
    }

    async connect() {
        try {
            await this.consumer.connect();
            console.log(`consumer ${this.consumerId} connected ✅`);
            await this.consumer.subscribe({ topic: "polling-topic", fromBeginning: true });
            await this.consumer.run({
                eachMessage: async ({ partition, message }) => {
                    console.log({
                        partition,
                        value: message?.value?.toString(),
                    })
                    console.log(`Handling vote from consumer ${this.consumerId}`)
                    const vote: {
                        poll_id: number,
                        option_id: number,
                        timestamp: string
                    } = JSON.parse(message?.value?.toString() || '');

                    await prisma.$transaction(async (tx) => {

                        const existingVote = await tx.votes.findFirst({
                            where: {
                                poll_id: vote.poll_id,
                                option_id: vote.option_id,
                                voted_at: new Date(vote.timestamp)
                            }
                        });
                        if (existingVote) {
                            console.log('duplicate vote detected');
                            return;
                        }

                        const pollNOption = await tx.options.findFirst({
                            where: {
                                id: vote.option_id,
                                poll_id: vote.poll_id
                            }
                        })

                        if (!pollNOption) {
                            // throw new createError('Option not found', 404);
                            console.log(`Option not found, poll_id=${vote.poll_id} and option_id=${vote.option_id}`);
                            return;
                        }

                        await tx.votes.create({
                            data: {
                                poll_id: vote.poll_id,
                                option_id: vote.option_id,
                                voted_at: new Date(vote.timestamp)
                            }
                        });
                        await tx.options.update({
                            where: { id: vote.option_id },
                            data: { vote_count: { increment: 1 } }
                        });

                        console.log("vote added ✅");
                    })
                }
            });
        } catch (error: any) {
            console.error(`Failed to connect to KafkaConsumer ${this.consumerId}`, error);
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

const kafkaConsumer1 = new KafkaConsumer('1');
const kafkaConsumer2 = new KafkaConsumer('2');
const kafkaConsumer3 = new KafkaConsumer('3');

export { kafkaConsumer1, kafkaConsumer2, kafkaConsumer3 };