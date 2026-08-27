import path from "node:path";
import fastifyAutoload from "@fastify/autoload";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const externalPluginsRegistry = fp(
	async (app: FastifyInstance) => {
		await app.register(fastifyAutoload, {
			dir: path.join(import.meta.dirname, "external"),
			options: {},
		});
	},
	{
		name: "external-plugins",
	},
);

export default externalPluginsRegistry;
