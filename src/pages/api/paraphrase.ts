import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function paraphraseWithGpt3(text: string): Promise<string> {
	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `When it comes to writing articles, there are two crucial factors: "perplexity" and "burstiness". Perplexity measures the complexity of the text. Burstiness compares the variation of the sentences. Humans tend to write with greater burstiness with sentences that vary in length between short sentences, long ones. While AI write sentences that are more uniform. Therefore I am asking you to balance perplexity and burstiness while writing something that appears more likely to be written by a human than AI. Using the concepts discussed earlier, rewrite this essay in the style of a amateur high school student with a burstiness of 200% and a perplexity of 20%: ${text} \n\n\n\nParaphrased text:`,
			max_tokens: 3000,
			n: 1,
			stop: null,
			temperature: 0.7,
		});
		if (response.data.choices[0].text) {
			const replacedString = response.data.choices[0].text
				.trim()
				.replace(/[phixoyjle]/g, (match) => {
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
