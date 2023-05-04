const ProbabilityIndicator = ({
	inputText,
	probabilities,
}: {
	inputText: string;
	probabilities: {
		average_generated_prob: number;
		completely_generated_prob: number;
		overall_burstiness: number;
	};
}) => {
	const {
		average_generated_prob,
		completely_generated_prob,
		overall_burstiness,
	} = probabilities;

	const probabilityValue = (value: number) =>
		value === 0 ? "Not Calculated" : value.toFixed(4);

	return (
		<div className="p-6 my-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<h2 className="mb-2 text-lg font-semibold">
				{average_generated_prob > 0.7 || completely_generated_prob > 0.7
					? "Your text is likely  written entirely by AI"
					: average_generated_prob > 0.5 || completely_generated_prob > 0.5
					? "Your text may be partially written by AI"
					: average_generated_prob || completely_generated_prob
					? "Your text is likely entirely written by a human"
					: "Likelihood AI-generated"}
			</h2>
			{/* <p className="p-3 bg-gray-100 rounded-md dark:bg-gray-700">
				{inputText || "No input provided"}
			</p> */}
			<div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
				<div className="p-4 bg-gray-100 rounded-md dark:bg-gray-700">
					<h3 className="mb-1 font-semibold">Average Generated Probability</h3>
					<p>{probabilityValue(average_generated_prob)}</p>
				</div>
				<div className="p-4 bg-gray-100 rounded-md dark:bg-gray-700">
					<h3 className="mb-1 font-semibold">
						Completely Generated Probability
					</h3>
					<p>{probabilityValue(completely_generated_prob)}</p>
				</div>
				<div className="p-4 bg-gray-100 rounded-md dark:bg-gray-700">
					<h3 className="mb-1 font-semibold">Overall Burstiness</h3>
					<p>{probabilityValue(overall_burstiness)}</p>
				</div>
			</div>
		</div>
	);
};

export default ProbabilityIndicator;
