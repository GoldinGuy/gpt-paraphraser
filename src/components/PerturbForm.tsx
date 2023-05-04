import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import ProbabilityIndicator from "./ProbIndicator";

const PerturbForm = ({
	onParaphrase,
}: {
	onParaphrase: (text: string) => Promise<string>;
}) => {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [loading, setLoading] = useState(false);
	const [probabilities, setProbabilities] = useState({
		average_generated_prob: 0,
		completely_generated_prob: 0,
		overall_burstiness: 0,
	});
	const [outputProbabilities, setOutputProbabilities] = useState({
		average_generated_prob: 0,
		completely_generated_prob: 0,
		overall_burstiness: 0,
	});

	const fetchProbabilities = async (input: string, isInput: boolean) => {
		const response = await fetch("/api/detect_ai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ document: input }),
		});

		if (response.ok) {
			const data = await response.json();
			if (isInput) {
				setProbabilities(data);
			} else {
				setOutputProbabilities(data);
			}
		} else {
			console.error("Failed to fetch probabilities");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		setOutputProbabilities({
			average_generated_prob: 0,
			completely_generated_prob: 0,
			overall_burstiness: 0,
		});
		setOutputText("");
		fetchProbabilities(inputText, true);
		const paraphrasedText = await onParaphrase(inputText);
		fetchProbabilities(paraphrasedText, false);
		setOutputText(paraphrasedText);
		setLoading(false);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(outputText);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-start w-full h-full m-auto mx-3 md:mx-10 lg:flex-row"
		>
			<div className="mb-3 md:mr-4">
				<label
					htmlFor="input-text"
					className="block text-sm font-medium text-gray-700"
				>
					Original Text
				</label>
				<div>
					<textarea
						id="input-text"
						readOnly={loading}
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						className="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
						rows={10}
						maxLength={3000}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-400 border border-transparent rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300"
				>
					{loading ? "Perturbing..." : "Bypass GPT Detectors"}
				</button>
				<ProbabilityIndicator
					inputText={inputText}
					probabilities={probabilities}
				/>
			</div>
			<div>
				<label
					htmlFor="output-text"
					className="block text-sm font-medium text-gray-700"
				>
					Paraphrased Text
				</label>
				<textarea
					id="output-text"
					value={outputText}
					readOnly
					className="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-300"
					rows={10}
				/>
				<button
					type="button"
					onClick={handleCopy}
					className="w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-orange-400 border border-transparent rounded-md hover:bg-orange-500 focus:outline-none focus:ring focus:border-orange-300"
				>
					Copy to Clipboard
				</button>
				<ProbabilityIndicator
					inputText={inputText}
					probabilities={outputProbabilities}
				/>
			</div>
		</form>
	);
};

export default PerturbForm;
