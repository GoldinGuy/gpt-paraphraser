import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

// export const config = {
//   runtime: 'edge',
// };

const configuration = new Configuration({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function paraphraseWithGpt3(text: string): Promise<string> {
	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `There are two crucial factors when writing essays: "perplexity" and "burstiness". Perplexity evaluates complexity of text, while Burstiness measures variation in sentence length. Humans write sentences with high burstiness that vary in length, while AI authors sentences that are more uniform. Balance perplexity and burstiness and write something that appears more likely to be written by a human than AI. Using the concepts discussed earlier, rewrite this essay in the style of a amateur high school student with a burstiness of 200% and a perplexity of 20%: ${text} \n\n\n\nParaphrased text:`,
			max_tokens: 3000,
			n: 1,
			stop: null,
			frequency_penalty: 0.4,
			presence_penalty: 0.4,
			temperature: 0.8,
		});
		if (response.data.choices[0].text) {
			const replacedString = response.data.choices[0].text
				.trim()
				.replace(/[phixoylje]/g, (match) => {
					switch (match) {
						case "p":
							return "р";
						case "h":
							return "һ";
						case "i":
							return "і";
						case "x":
							return "х";
						case "o":
							return "о";
						case "j":
							return "ј";
						case "y":
							return "у";
						case "l":
							return "ӏ";

						case "e":
							return "е";
						default:
							return match;
					}
				});
			return replacedString;
		} else return "GPT-3 API error";
	} catch (error) {
		console.error("GPT-3 API error:", error);
		return "GPT-3 API error";
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}

	const { text } = req.body;

	if (!text) {
		res.status(400).json({ message: "Missing text parameter" });
		return;
	}

	const paraphrasedText = await paraphraseWithGpt3(text);

	if (paraphrasedText) {
		res.status(200).json({ paraphrasedText });
	} else {
		res
			.status(200)
			.json({ paraphrasedText: "an error occurred when paraphrasing" });
	}
}
