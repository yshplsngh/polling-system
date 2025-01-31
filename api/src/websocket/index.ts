import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import prisma from "../database";

interface PollDataType {
    id: number;
    question: string;
    options: {
        id: number;
        option_text: string;
        vote_count: number;
    }[];
}
export interface LeaderboardDataType {
    id: number;
    question: string;
    total_votes: number;
    options: {
        id: number;
        option_text: string;
        vote_count: number;
    } | undefined
}
enum WSMessageType {
    CONNECT = 'WS_CONNECT',
    DISCONNECT = 'WS_DISCONNECT',
}
enum SubscriptionType {
    SINGLE_POLL_UPDATE = 'SINGLE_POLL_UPDATE',
    LEADERBOARD_UPDATE = 'LEADERBOARD_UPDATE'
}
interface ConnectionMessageType {
    type: WSMessageType
    key: number | 'leaderboard'
}
interface PollDataMessageType {
    type: SubscriptionType
    data: PollDataType
}
interface LeaderboardDataMessageType {
    type: SubscriptionType
    data: LeaderboardDataType[]
}

class websocketSetup {
    private wss: WebSocketServer;

    // key is poll_id of poll page or leaderboard of leaderboard page and value is set of connected clients contain ws

    // 1 : [ws1,ws2,ws3]
    // 2 : [ws4,ws1,ws2]
    // 'leaderboard' : [ws1,ws5,ws6]
    private connectedSubscriptions: Map<number | 'leaderboard', Set<WebSocket>> = new Map();

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.setupConnection();
    }

    private setupConnection() {
        this.wss.on('connection', async (ws: WebSocket) => {
            console.log('webSocket client connected 🔌')
            ws.on('message', (rawMessage) => {
                try {
                    const message = JSON.parse(rawMessage.toString()) as ConnectionMessageType;
                    if (message.type === WSMessageType.CONNECT) {
                        this.handleConnection(ws, message);
                    }
                    else if (message.type === WSMessageType.DISCONNECT) {
                        this.handleDisconnect(ws, message);
                    }
                } catch (error) {
                    console.log('error in websocket message', error);
                }
            })

            ws.on('close', () => {
                // if a client of particular ws is disconected then delete that ws from all sets
                // maybe user route to multiple polls and leaderboard so it will delete that ws from all sets
                this.connectedSubscriptions.forEach((singleMap) => {
                    singleMap.delete(ws);
                })
            })
        })
    }

    private handleConnection(ws: WebSocket, message: ConnectionMessageType) {

        if (!this.connectedSubscriptions.has(message.key)) {
            this.connectedSubscriptions.set(message.key, new Set());
        }
        this.connectedSubscriptions.get(message.key)?.add(ws);
        console.log('New client connected =>', message.key);
    }
    private handleDisconnect(ws: WebSocket, message: ConnectionMessageType) {
        // remove ws from a set of particular key
        // key can be poll_id or 'leaderboard'
        this.connectedSubscriptions.get(message.key)?.delete(ws);
        console.log('client disconnected from =>', message.key);
    }

    sendPollsData({ options, id, question }: PollDataType) {
        const getSingleMap = this.connectedSubscriptions.get(id);
        if (!getSingleMap) return;

        const totalVotes = options.reduce((acc, option) => acc + option.vote_count, 0);
        const message: PollDataMessageType = {
            type: SubscriptionType.SINGLE_POLL_UPDATE,
            data: {
                id,
                question,
                options: options.map((option) => {
                    return {
                        id: option.id,
                        option_text: option.option_text,
                        vote_count: option.vote_count,
                        percentage: Math.round((option.vote_count / totalVotes) * 100) || 0
                    }
                })
            }
        }
        getSingleMap.forEach((particularWS) => {
            if (particularWS.readyState === WebSocket.OPEN) {
                particularWS.send(JSON.stringify(message));
            }
        })
    }

    
    async sendLeaderboardData(){
        const getLeaderboardMap = this.connectedSubscriptions.get('leaderboard');
        if(!getLeaderboardMap) return;

        const leaderboard = await prisma.polls.findMany({
            select: {
                id: true,
                question: true,
                options: {
                    orderBy: {
                        vote_count: 'desc'
                    },
                    take: 1,
                    select: {
                        id: true,
                        option_text: true,
                        vote_count: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const pollTotalVotes = await prisma.options.groupBy({
            by: ['poll_id'],
            _sum: { vote_count: true }
        })
        // map => poll_id, total_votes
        const pollTotalVotesMap = new Map(pollTotalVotes.map(poll => [poll.poll_id,poll._sum.vote_count]))
    
        const finalLeaderboard = leaderboard.map((poll)=>{
            return {
                id:poll.id,
                question:poll.question,
                total_votes: pollTotalVotesMap.get(poll.id) ?? 0,
                options:poll.options[0] // options arraywill contain only one option
            }
        })

        const message: LeaderboardDataMessageType = {
            type: SubscriptionType.LEADERBOARD_UPDATE,
            data: finalLeaderboard
        }

        getLeaderboardMap.forEach((particularWS) => {
            if(particularWS.readyState === WebSocket.OPEN){
                particularWS.send(JSON.stringify(message))
            }
        })
    }
}

export default websocketSetup;