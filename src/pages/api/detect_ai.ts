import type { NextApiRequest, NextApiResponse } from "next";

type ProbabilityData = {
	average_generated_prob: number;
	completely_generated_prob: number;
	overall_burstiness: number;
};

async function getPredictions(
	document: string
): Promise<ProbabilityData | null> {
	const res = await fetch("https://api.gptzero.me/v2/predict/text", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			accept: "application/json",
			"X-Api-Key": process.env.NEXT_PUBLIC_GPT_ZERO_API_KEY ?? "UNDEFINED",
		},
		body: JSON.stringify({ document }),
	});
	// console.log("res", res);

	if (res.ok) {
		const data = await res.json();
		const probabilities: ProbabilityData = {
			average_generated_prob: data.documents[0].average_generated_prob,
			completely_generated_prob: data.documents[0].completely_generated_prob,
			overall_burstiness: data.documents[0].overall_burstiness,
		};
		console.log("probs", probabilities);
		return probabilities;
	}

	return null;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const document = req.body.document;

	if (typeof document === "string") {
		// console.log("document", document);
		const probabilities = await getPredictions(document);

		if (probabilities) {
			res.status(200).json(probabilities);
		} else {
			res.status(500).json({ error: "Failed to fetch predictions" });
		}
	} else {
		res.status(400).json({ error: "Invalid request body" });
	}
}
