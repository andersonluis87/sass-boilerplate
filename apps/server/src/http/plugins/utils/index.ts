import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import createSlug from "./create-slug.util";

export default fp(
	async function registerUtils(app: FastifyInstance) {
		await app.register(createSlug);
	},
	{
		name: "utils",
	},
);
