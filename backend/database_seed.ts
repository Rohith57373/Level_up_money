import { QdrantClient } from "@qdrant/js-client-rest";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "node:fs/promises";
import { v4 as uuidv4 } from "npm:uuid";
import { embeddingModel } from "./agent.ts";

async function splitFile(filePath: string) {
	try {
		const content = await fs.readFile(filePath, "utf-8");

		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const chunks = await splitter.splitText(content);

		return chunks;
	} catch (error) {
		console.error("Error reading or splitting file:", error);
	}
}

const client = new QdrantClient({ host: "localhost", port: 6333 });

// await client.createCollection("test_collection", {
// 	vectors: { size: 768, distance: "Dot" },
// });

const doc_chunks = await splitFile("policy_data.txt");

for (const chunk of doc_chunks!) {
	try {
		const embeddedvector = await embeddingModel.embedQuery(chunk);
		await client.upsert("doc_context", {
			points: [
				{
					id: uuidv4(),
					vector: embeddedvector,
					payload: {
						content: chunk,
					},
				},
			],
		});
	} catch (error) {
		console.log(error);
	}
}
