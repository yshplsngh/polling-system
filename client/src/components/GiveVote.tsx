import { useParams } from "react-router-dom";
import { fetchData } from "../utils";
import { useEffect, useState } from "react";

interface PollType {
    poll_id: number;
    question: string;
    options: {
        id: number;
        option_text: string;
        vote_count: number;
        poll_id: number;
    }[]
}

const GiveVote = () => {
    const { id } = useParams()
    const [poll, setPoll] = useState<PollType>()
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isVoted, setIsVoted] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchData(`/polls/${id}`, "GET").then((data) => {
            if (data.data) {
                setPoll(data.data)
            }
        })
    }, [id])

    const handleVote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id || !poll || !selectedOption || isNaN(selectedOption)) return;

        fetchData(`/polls/${id}/vote`, "POST", { option_id: selectedOption }).then((data) => {
            console.log(data)
            setIsVoted(true)
        }).catch((err) => {
            console.log(err)
            alert(err.message)
        })
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">{poll?.question}</h1>
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
                                value={option.id}
                                onChange={() => setSelectedOption(option.id)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-lg">{option.option_text}</span>
                        </label>
                    </div>
                ))}

                {!isVoted ? <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6"
                >
                    Submit Vote
                </button> : ""}
            </form>
        </div>
    )
}

export default GiveVote;