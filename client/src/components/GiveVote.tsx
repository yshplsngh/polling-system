import { useParams } from "react-router-dom";
import { fetchData } from "../utils";
import { useEffect, useState } from "react";
import { ConnectionMessageType, PollDataMessageType, PollDataType, SubscriptionType, WSType } from "./types";

const GiveVote = () => {
    const { id: raw_poll_id } = useParams()

    // backend expects key of this page which is poll_id as number so convert string to number
    const id = raw_poll_id && +raw_poll_id;
    const [poll, setPoll] = useState<PollDataType>()
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)

    useEffect(() => {
        if (!id) return;
        fetchData(`/polls/${id}`, "GET").then((data) => {
            if (data.data) {
                setPoll(data.data)
                // console.log(data.data)
            }
        })
    }, [id])

    // Websocket connection
    useEffect(() => {
        if (!id) return;

        const ws = new WebSocket('ws://localhost:4000');
        ws.onopen = () => {
            const message: ConnectionMessageType = {
                type: WSType.CONNECT,
                key: id
            }
            ws.send(JSON.stringify(message))
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as PollDataMessageType
            // receive message from websocket only if it is for this page
            if(data.type === SubscriptionType.SINGLE_POLL_UPDATE){
                setPoll(data.data)
            }
        }

        return () => {
            if(ws.readyState === WebSocket.OPEN){
                const message:ConnectionMessageType = {
                    type: WSType.DISCONNECT,
                    key: id
                }
                ws.send(JSON.stringify(message))
                ws.close();
            }
        }
    },[id]);

    const handleVote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id || !poll || !selectedOptionId || isNaN(selectedOptionId)) return;

        fetchData(`/polls/${id}/vote`, "POST", { option_id: selectedOptionId }).then((data) => {
            console.log(data)
            setSelectedOptionId(null)
            // setIsVoted(true)
        }).catch((err) => {
            console.log(err)
            alert(err.message)
        })
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6 text-center">{poll?.question}</h1>

            {/* {isVoted ? ( */}
            <div className="space-y-4">
                {poll?.options.map((option) => (
                    <div key={option.id} className="flex flex-row items-center space-x-1.5">
                        <div className="relative w-full h-12 border-2 border-blue-600 rounded-md overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${option.percentage}%` }}
                            />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center px-3">
                                <span className="text-lg text-black drop-shadow-md">
                                    {option.option_text}
                                </span>
                            </div>
                        </div>
                        <span className="text-lg min-w-[4rem] text-right">
                            {option.percentage}%
                        </span>
                    </div>
                ))}
            </div>
            {/* ) : ""} */}

            <hr className="border-gray-200" />
            {/* vote form */}
            {/* {!isVoted ? ( */}
            <form className="space-y-4" onSubmit={(e) => handleVote(e)}>
                {poll?.options.map((option) => (
                    <div
                        key={option.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="poll-option"
                                checked={selectedOptionId === option.id}
                                onChange={() => setSelectedOptionId(option.id)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-lg">{option.option_text}</span>
                        </label>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6"
                >
                    Submit Vote
                </button>
            </form>
            {/* ) : ""} */}
        </div>
    )
}

export default GiveVote;