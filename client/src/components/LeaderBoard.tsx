// it will show all polls with poll question and total votes 
// and top one option with highest vote

import { useEffect, useState } from "react";
import { fetchData } from "../utils";

interface PollsType {
    poll_id: number;
    poll_question: string;
    total_votes: number;
    top_option: {
        id: number;
        option_text: string;
        vote_count: number;
    }
}
const LeaderBoard = () => {
    const [polls, setPolls] = useState<PollsType[]>([]);

    useEffect(() => {
        fetchData('/leaderboard', 'GET', {}).then((data) => {
            setPolls(data.polls);
        })
    }, [])

    console.log(polls);

    return (
        <div className="bg-white p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">LeaderBoard</h1>
            <div className="flex flex-col w-[30rem] shadow-md rounded-lg p-5">
                {polls.map((poll) => (
                    <div key={poll.poll_id}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold mb-2">{poll.poll_question}</h2>
                            <p className="text-gray-600">Total Votes: {poll.total_votes}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="mt-4 w-full">
                                <p className="text-md font-bold mb-1">Top Option:</p>
                                <div className="bg-blue-100 rounded-md p-2 w-full">
                                    <p className="text-blue-800 font-semibold">{poll.top_option.option_text}</p>
                                    <p className="text-blue-600">{poll.top_option.vote_count} Votes</p>
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