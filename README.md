# LING 227 Final Project: GPT Paraphraser + Matlab CNN

## Getting Started

After cloning the repo, install deps and run the development server:

```bash
yarn install

npm run dev
# or
yarn dev
# or
pnpm dev
```

Then create a new  `.env` file and add your `OPENAI` and `GPTZero` API keys. 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

`/src` contains all of the code for the web app. `/api` contains the two primary API files – one for paraphrasing, and one for AI detection. `/matlab` contains all of the code for CNN and matlab analysis. 

## More Info

This project is deployed on Vercel at [https://ling227final.goldin.io/](https://ling227final.goldin.io/). 

We are making use of OpenAI API's availiable at [https://platform.openai.com/docs/api-reference/completions](https://platform.openai.com/docs/api-reference/completions) and GPTZero's API available at [https://gptzero.me/docs](https://gptzero.me/docs). 
