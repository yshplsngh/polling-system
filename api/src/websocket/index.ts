import { Server } from "http";
import { WebSocketServer ,WebSocket} from "ws";
import {options} from '@prisma/client'

interface wsMessageType{
    type:'WS_CONNECT'|'WS_DISCONNECT';
    poll_id:number;
}

class websocketSetup{
    private wss:WebSocketServer;

    // key is poll_id and value is set of connected clients contain ws
    private connectedClients:Map<number,Set<WebSocket>> = new Map();

    constructor(server:Server){
        this.wss = new WebSocketServer({server});
        this.setupConnection();
    }

    private setupConnection(){
        this.wss.on('connection', async (ws:WebSocket) => {
            console.log('webSocket client connected 🔌')
            ws.on('message', (rawMessage)=>{
                try{
                    const message = JSON.parse(rawMessage.toString()) as wsMessageType;
                    // console.log('message',message);
                    if(message.type === 'WS_CONNECT'){
                        this.handleConnection(ws,message);
                    }
                }catch(error){
                    console.log('error in websocket message',error);
                }
            })

            ws.on('close',()=>{
                this.connectedClients.forEach((singleClientMap)=>{
                    // it will delete specific ws from the from all sets, 
                    // and single set for every poll_id
                    singleClientMap.delete(ws);
                })
                console.log('a client is disconnected from all polls');
            })
        })
    }

    private handleConnection(ws:WebSocket,message:wsMessageType){
        if(!this.connectedClients.has(message.poll_id)){
            this.connectedClients.set(message.poll_id,new Set());
        }
        this.connectedClients.get(message.poll_id)?.add(ws);
        console.log('new client connected to poll',message.poll_id);
    }

    sendPollsData({poll_id,options}:{poll_id:number,options:options[]}){
        const getClientsOfPoll = this.connectedClients.get(poll_id);
        if(!getClientsOfPoll) return;

        const message = JSON.stringify({
            type:'POLL_UPDATE',
            data:{
                poll_id,
                options:options.map((option)=>{
                    return {
                        id:option.id,
                        option_text:option.option_text,
                        vote_count:option.vote_count
                    }
                })
            }
        })

        getClientsOfPoll.forEach((singleClient)=>{
            if(singleClient.readyState === WebSocket.OPEN){
                singleClient.send(message);
            }
        })
    }
}

export default websocketSetup;