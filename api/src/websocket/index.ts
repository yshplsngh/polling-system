import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface wsMessageType {
    type: 'WS_CONNECT' | 'WS_DISCONNECT';
    poll_id: number;
}

class websocketSetup {
    private wss: WebSocketServer;

    // key is poll_id and value is set of connected clients contain ws
    private connectedClients: Map<number, Set<WebSocket>> = new Map();

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.setupConnection();
    }

    private setupConnection() {
        this.wss.on('connection', async (ws: WebSocket) => {
            console.log('webSocket client connected 🔌')
            ws.on('message', (rawMessage) => {
                try {
                    const message = JSON.parse(rawMessage.toString()) as wsMessageType;
                    if (message.type === 'WS_CONNECT') {
                        this.handleConnection(ws, message);
                    }
                    else if (message.type === 'WS_DISCONNECT') {
                        this.handleDisconnect(ws, message);
                    }
                } catch (error) {
                    console.log('error in websocket message', error);
                }
            })

            ws.on('close', () => {
                this.connectedClients.forEach((singleClientMap) => {
                    // it will delete specific ws from the from all sets, 
                    // and single set for every poll_id
                    singleClientMap.delete(ws);
                })
                console.log('a client is disconnected from all polls');
            })
        })
    }

    private handleConnection(ws: WebSocket, message: wsMessageType) {
        console.log("in handleConnection",message);
        if (!this.connectedClients.has(message.poll_id)) {
            this.connectedClients.set(message.poll_id, new Set());
        }
        this.connectedClients.get(message.poll_id)?.add(ws);
        console.log('new client connected to poll', message.poll_id);
    }
    private handleDisconnect(ws: WebSocket, message: wsMessageType) {
        this.connectedClients.get(message.poll_id)?.delete(ws);
        console.log('client disconnected from poll ', message.poll_id);
    }

    sendPollsData({options,id:poll_id,question}: {
        options: {
            id: number;
            option_text: string;
            vote_count: number;
        }[];
        id: number;
        question: string;
    }) {
        const getClientsOfPoll = this.connectedClients.get(poll_id);
        if (!getClientsOfPoll) return;

        const totalVotes = options.reduce((acc,option)=> acc+option.vote_count,0);

        const message = JSON.stringify({
            type: 'SINGLE_POLL_UPDATE',
            data: {
                poll_id,
                question,
                options:options.map((option)=>{
                    return {
                        id:option.id,
                        option_text:option.option_text,
                        vote_count:option.vote_count,
                        percentage: Math.round((option.vote_count/totalVotes)*100)
                    }
                })
            }
        })

        getClientsOfPoll.forEach((singleClient) => {
            if (singleClient.readyState === WebSocket.OPEN) {
                singleClient.send(message);
            }
        })
    }
}

export default websocketSetup;