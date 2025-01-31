// load votes in real time implement websocket

import { useEffect, useState } from "react";
import { fetchData } from "../utils";
import { Link } from "react-router-dom";
import { ConnectionMessageType, LeaderboardDataMessageType, LeaderboardPollDataType, SubscriptionType, WSType } from "./types";

const LeaderBoard = () => {
    const [polls, setPolls] = useState<LeaderboardPollDataType[]>([]);

    useEffect(() => {
        fetchData('/leaderboard', 'GET').then((data) => {
            setPolls(data.data);
            console.log(data)
        })
    }, [])

    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:4000');
        ws.onopen = () => {
            const message:ConnectionMessageType = {
                type:WSType.CONNECT,
                key:'leaderboard'
            }
            ws.send(JSON.stringify(message))
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as LeaderboardDataMessageType
            if(data.type === SubscriptionType.LEADERBOARD_UPDATE){
                setPolls(data.data);
            }
        }
        return () => {
            if(ws.readyState === WebSocket.OPEN){
                const message:ConnectionMessageType = {
                    type:WSType.DISCONNECT,
                    key:'leaderboard'
                }
                ws.send(JSON.stringify(message))
                ws.close();
            }
        }
    },[])

    return (
        <div className=" p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">LeaderBoard</h1>
            <div className="flex flex-col w-[30rem] shadow-md rounded-lg p-5">
                {polls.map((poll) => (
                    <div key={poll.id}>
                        <div className="flex justify-between items-center">
                            <Link to={`/poll/${poll.id}`}>
                                <h2 className="text-xl font-bold mb-2 hover:text-blue-500 underline">{poll.question}</h2>
                            </Link>
                            <p className="text-gray-600">Total Votes: {poll.total_votes}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="mt-4 w-full">
                                <p className="text-md font-bold mb-1">Top Option:</p>
                                <div className="bg-blue-100 rounded-md p-2 w-full">
                                    <p className="text-blue-800 font-semibold">{poll.options.option_text}</p>
                                    <p className="text-blue-600">{poll.options.vote_count} Votes</p>
                                </div>
                            </div>
                        </div>
                        <hr className="my-4" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeaderBoard;