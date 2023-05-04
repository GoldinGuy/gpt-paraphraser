import Image from "next/image";
import { Inter } from "next/font/google";
import PerturbForm from "@/components/PerturbForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	// const callPara = async (text: string): Promise<string> => {
	// 	const response = await fetch("/api/paraphrase", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({ text }),
	// 	});

	// 	if (response.ok) {
	// 		const data = await response.json();
	// 		console.log("finished para");
	// 		return data.paraphrasedText;
	// 	} else {
	// 		throw new Error("Paraphrasing API error");
	// 	}
	// };

	// const paraphraseText = async (text: string): Promise<string> => {
	// 	console.log(text);
	// 	try {
	// 		// Using character length
	// 		// const chunkSize = 1000;
	// 		// const chunks = [];
	// 		// for (let i = 0; i < text.length; i += chunkSize) {
	// 		// 	chunks.push(text.slice(i, i + chunkSize));
	// 		// }
	// 		// using paragraphs
	// 		const paragraphs = text.split("\n\n");
	// 		const apiPromises = paragraphs.map((chunk) => callPara(chunk));
	// 		const processedChunks = await Promise.all(apiPromises);
	// 		return processedChunks.join("\n\n");
	// 	} catch (error) {
	// 		console.error("Error:", error);
	// 		return "Failed to paraphrase the text";
	// 	}
	// };

	const paraphraseText = async (text: string): Promise<string> => {
		console.log(text);
		try {
			const response = await fetch("/api/paraphrase", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text }),
			});

			if (response.ok) {
				const data = await response.json();
				return data.paraphrasedText;
			} else {
				throw new Error("Paraphrasing API error");
			}
		} catch (error) {
			console.error("Error:", error);
			return "Failed to paraphrase the text";
		}
	};

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} w-full overflow-auto`}
		>
			<img
				alt="bg"
				src="/bg.jpeg"
				className="fixed top-0 left-0 z-0 object-cover w-full h-full min-w-full"
			/>

			<div className="z-10 items-center justify-between w-full max-w-5xl font-mono text-lg lg:flex">
				<p className="fixed top-0 left-0 flex justify-center w-full pt-8 pb-6 border-b border-gray-300 bg-gradient-to-b from-gray-200 backdrop-blur-2xl ">
					<code className="font-mono font-bold text-gray-600">
						GPT Paraphraser
					</code>
				</p>
			</div>

			<div className="fixed flex items-start h-full pt-1 mb-20 overflow-scroll lg:pt-16">
				<PerturbForm onParaphrase={paraphraseText} />
			</div>

			<div className="absolute px-5 bottom-4 md:bottom-10">
				<a
					href="https://github.com/GoldinGuy/gpt-paraphraser"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center w-full text-center lg:mb-0 lg:text-left "
				>
					{" "}
					<Image
						src="./github-mark.svg"
						alt="GitHub Logo"
						width={25}
						height={25}
						className="mr-3 text-gray-500"
					/>
					<span className="z-10 flex items-center justify-center font-mono text-sm text-gray-500">
						LING 227 Final Project | Seth Goldin & Xavier Guaracha
					</span>
				</a>
			</div>
		</main>
	);
}
