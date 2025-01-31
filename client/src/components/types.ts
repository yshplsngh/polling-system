import { z } from "zod";

export const createPollSchema = z.object({
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2)
})

export type CreatePollSchema = z.infer<typeof createPollSchema>

export interface PollDataType{
    id: number;
    question: string;
    options: {
        id: number;
        option_text: string;
        vote_count: number;
        percentage: number;
    }[]
}
export interface LeaderboardPollDataType {
    id: number;
    question: string;
    total_votes: number;
    options: {
        id: number;
        option_text: string;
        vote_count: number;
    }
}

export enum WSType {
    CONNECT = 'WS_CONNECT',
    DISCONNECT = 'WS_DISCONNECT',
}
export enum SubscriptionType {
    SINGLE_POLL_UPDATE = 'SINGLE_POLL_UPDATE',
    LEADERBOARD_UPDATE = 'LEADERBOARD_UPDATE'
}
export interface ConnectionMessageType {
    type: WSType
    key: number | 'leaderboard'
}
export interface PollDataMessageType {
    type: SubscriptionType
    data: PollDataType
}
export interface LeaderboardDataMessageType {
    type: SubscriptionType
    data: LeaderboardPollDataType[]
}