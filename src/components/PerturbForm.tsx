import React, { useState } from "react";
import "tailwindcss/tailwind.css";

type PerturbFormProps = {
	onParaphrase: (text: string) => Promise<string>;
};

const PerturbForm: React.FC<PerturbFormProps> = ({ onParaphrase }) => {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const paraphrasedText = await onParaphrase(inputText);
		setOutputText(paraphrasedText);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(outputText);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-start w-full h-full m-auto lg:flex-row "
		>
			<div className="mb-3 mr-4">
				<label
					htmlFor="input-text"
					className="block text-sm font-medium text-gray-700"
				>
					Original Text
				</label>
				<div>
					<textarea
						id="input-text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						className="block px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm w-80 md:w-96 focus:ring focus:border-blue-300"
						rows={10}
						required
					/>
				</div>
				<button
					type="submit"
					className="px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-400 border border-transparent rounded-md w-80 md:w-96 hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300"
				>
					Paraphrase
				</button>
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
					className="block px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md shadow-sm w-80 md:w-96 focus:ring focus:border-blue-300"
					rows={10}
				/>
				<button
					type="button"
					onClick={handleCopy}
					className="w-full px-4 py-2 mt-1 mt-2 text-sm font-medium text-white bg-orange-400 border border-transparent rounded-md hover:bg-orange-500 focus:outline-none focus:ring focus:border-orange-300"
				>
					Copy to Clipboard
				</button>
			</div>
		</form>
	);
};

export default PerturbForm;
