// it will have a form to create a poll with poll question and options

import { useState } from "react";
import { fetchData } from "../utils";
import { createPollSchema } from "./types";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
    const [pollData, setPollData] = useState<{ question: string, options: { [key: number]: string } }>({ question: '', options: {} });
    const navigate = useNavigate();

    const pollQuestion = (
        <div className="w-full">
            <label htmlFor="pollQuestion" className="text-md font-bold mb-1">Poll Question</label>
            <input
                type="text"
                onChange={(e) => setPollData((prev) => ({ ...prev, question: e.target.value }))}
                placeholder="Enter poll question"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={pollData.question}
                />
        </div>
    )

    const pollOption = (index: number) => (
        <div key={index}>
            <label htmlFor="pollOptions" className="text-md font-bold mb-1">Poll Option {index+1}</label>
            <input
                type="text"
                onChange={(e) => setPollData((prev) => ({ ...prev, options: { ...prev.options, [index]: e.target.value } }))}
                value={pollData.options[index]}
                placeholder="Enter poll option"
                className="w-full p-2 border border-gray-300 rounded-md"
            />
        </div>
    )
    const [pollOptions, setPollOptions] = useState([pollOption(0), pollOption(1)]);

    const addOption = () => {
        setPollOptions([...pollOptions, pollOption(pollOptions.length)])
    }
    const handleSubmit = async () => {
        const finalPollData = { question: pollData.question, options: Object.values(pollData.options) }

        const isValidate = createPollSchema.safeParse(finalPollData);
        if (!isValidate.success) {
            alert('All field are required')
            return;
        }

        fetchData('/polls', 'POST', isValidate.data).then((data) => {
            console.log(data)
            navigate(`/poll/${data.data.poll_id}`)
        }).catch((err)=>{
            alert(err.message)
        })
    }
    return (
        <div className=" mt-10 flex flex-col items-center p-5">
            <h1 className="text-2xl font-bold mb-4">Create Poll</h1>
            <div className="space-y-5 flex flex-col justify-center items-center w-[30rem shadow-md rounded-lg p-5">
                {pollQuestion}
                {pollOptions}
                <button type="button" onClick={() => addOption()} className="bg-zinc-800 text-white p-1 px-2 text-sm rounded-md">Add Option</button>
                <button type="submit" onClick={() => handleSubmit()} className="bg-zinc-900 text-white p-1 px-2 rounded-md w-full">Create Poll</button>
            </div>
        </div>
    )
}
export default CreatePoll;