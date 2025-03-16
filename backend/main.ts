import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { z } from "npm:zod";
import { agent } from "./agent.ts";
const app = new Hono();

app.get("/", (c) => c.text("Hello from Hono!"));
app.use(
	"*",
	cors({
		origin: "http://localhost:5173",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
//chat route
const loanChatQuery = z.object({
	chat_query: z.string(),
	target_language: z.string(),
	id: z.string(),
});

app.post("/loan_chat", async (c) => {
	const body = await c.req.json();
	try {
		const parsedBody = loanChatQuery.parse(body);
		console.log(parsedBody);
		const input_query = {
			chat_query: parsedBody.chat_query,
			target_language: parsedBody.target_language,
		};
		console.log("parsedBody", parsedBody);
		const input = {
			messages: [{ role: "user", content: JSON.stringify(input_query) }],
		};
		const config = {
			configurable: {
				thread_id: parsedBody.id,
			},
		};

		const agent_response = await agent.invoke(input, { ...config });
		const messages = agent_response.messages;
		console.log(messages);
		return c.json(messages[messages.length - 1].content);
	} catch (e) {
		console.log(e);
		c.status(500);
		return c.json({ error: e });
	}
});

Deno.serve(app.fetch);
