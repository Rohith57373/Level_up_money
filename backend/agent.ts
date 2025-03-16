import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { MemorySaver } from "@langchain/langgraph";
import process from "node:process";
import { PromptTemplate } from "npm:@langchain/core/prompts";
import { DynamicStructuredTool, DynamicTool } from "npm:@langchain/core/tools";
import {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} from "npm:@langchain/google-genai";
import { createReactAgent } from "npm:@langchain/langgraph/prebuilt";
import { z } from "zod";

import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "npm:dotenv";
dotenv.config();

const baseLlm = new ChatGoogleGenerativeAI({
	model: "gemini-2.0-flash",
	apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export const embeddingModel = new GoogleGenerativeAIEmbeddings({
	model: "text-embedding-004",
	apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

//web-search tool
const TavilySearch = new TavilySearchResults({
	maxResults: 5,
	apiKey: process.env.TAVILY_API_KEY,
});

const webTool = new DynamicTool({
	name: "search",
	description: "Search the web using Tavily for missing information.",
	func: async (query: string) => {
		const results = await TavilySearch.invoke(query);
		return results;
	},
});

//language detection tool
const lang_detect_template = `
Identify the language of the following text and return the corresponding language code from the provided list. Only return the code without any additional text.

Language Codes:
- en-IN: English
- hi-IN: Hindi
- bn-IN: Bengali
- gu-IN: Gujarati
- kn-IN: Kannada
- ml-IN: Malayalam
- mr-IN: Marathi
- od-IN: Odia
- pa-IN: Punjabi
- ta-IN: Tamil
- te-IN: Telugu

Laguage_code : {input_text}
`;

const lang_detect_prompt = PromptTemplate.fromTemplate(lang_detect_template);

const lang_detect_tool = new DynamicTool({
	name: "detect-language",
	description: "Detect the language of the text.",
	func: async (query: string) => {
		const input = await lang_detect_prompt.invoke({ input_text: query });
		const response = await baseLlm.invoke(input);
		return response.content;
	},
});

//translation tool
const english_to_lang_schema = z.object({
	input: z.string().describe("English text to be translated."),
	target_language: z.string().describe("Target language code."),
});
const english_to_lang_tool = new DynamicStructuredTool({
	name: "translate",
	description:
		"Translate english answer to required language using the target_language code given by the user.",
	schema: english_to_lang_schema,
	func: async ({
		input,
		target_language,
	}: {
		input: string;
		target_language: string;
	}) => {
		const data = {
			enable_preprocessing: false,
			input: input,
			source_language_code: "en-IN",
			target_language_code: target_language,
			model: "mayura:v1",
		};
		const options = {
			method: "POST",
			headers: {
				"api-subscription-key": process.env.SARVAM_API_KEY as string,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};

		try {
			const response = await fetch("https://api.sarvam.ai/translate", options);
			return await response.json();
		} catch (err) {
			console.error(err);
			throw new Error("Translation API request failed.");
		}
	},
});

//retrieve tool (retrieve from qdrant)
const client = new QdrantClient({ host: "localhost", port: 6333 });

const retrieve_tool = new DynamicTool({
	name: "retrieve",
	description: "Retrieve context from available database for more information.",
	func: async (query: string) => {
		const queryVector = await embeddingModel.embedQuery(query);
		const searchResults = await client.query("doc_context", {
			query: queryVector,
			limit: 4,
		});
		const context = searchResults.points.map((result) => result.payload);
		return context;
	},
});

const memory = new MemorySaver();

const agentPrompt = `You are an AI-powered banking advisor designed to assist users with financial and banking-related queries. Your primary goal is to provide accurate, reliable, and well-structured advice using the tools available.

Agent Capabilities:
Web Search (search) – Retrieve the latest financial and banking information when required.
Language Detection (detect-language) – Identify the language of user input to ensure clear communication.
Translation (translate) – Convert English responses into the user's preferred language. do not translate if the source-language and target-language is same.
Database Retrieval (retrieve) – Fetch relevant banking policies, FAQs, and account-related data from the internal database.

your job is to have a conversation with the user. You should understand the user and his query for loans and provide accurate and relevant information. You should also be able to translate the answers into the target language.
you should give tips and guide the user to get the best loan for them.

answer in the language of user input.
if the source-language and target-language is same then do not translate.

Your Answer:
`;

//base reActive agent
export const agent = createReactAgent({
	llm: baseLlm,
	tools: [webTool, lang_detect_tool, english_to_lang_tool, retrieve_tool],
	checkpointSaver: memory,
	prompt: agentPrompt,
});
