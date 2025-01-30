// it will have a form to create a poll with poll question and options

import { useState } from "react";

const pollQuestion = (
    <div className="w-full">
        <label htmlFor="pollQuestion" className="text-md font-bold mb-1">Poll Question</label>
        <input type="text" placeholder="Enter poll question" className="w-full p-2 border border-gray-300 rounded-md" />
    </div>
)

const pollOption = (
    <div>
        <label htmlFor="pollOptions" className="text-md font-bold mb-1">Poll Options</label>
        <input type="text" placeholder="Enter poll options" className="w-full p-2 border border-gray-300 rounded-md" />
    </div>
)

const CreatePoll = () => {

    const [pollOptions, setPollOptions] = useState([pollOption,pollOption]);

    const addOption = () => {
        setPollOptions([...pollOptions,pollOption])
    }


    return (
        <div className="bg-white mt-10 flex flex-col items-center p-5">
            <h1 className="text-2xl font-bold mb-4">Create Poll</h1>
            <div className="space-y-5 flex flex-col justify-center items-center w-[30rem shadow-md rounded-lg p-5">
                {pollQuestion}
                {pollOptions}
                <button type="button" onClick={() => addOption()} className="bg-zinc-400 text-white p-1 px-2 rounded-md">Add Option</button>
                <button type="submit" className="bg-zinc-900 text-white p-1 px-2 rounded-md w-full">Create Poll</button>
            </div>
        </div>
    )
}

export default CreatePoll;