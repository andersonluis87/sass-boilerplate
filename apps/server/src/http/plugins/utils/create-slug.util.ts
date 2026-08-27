import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

function createSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\\-]+/g, "")
		.replace(/\\-\\-+/g, "-");
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("createSlug", createSlug);
	},
	{
		name: "createSlug",
	},
);
