import path from "node:path";
import fastifyAutoload from "@fastify/autoload";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const appPluginsRegistry = fp(
	async (app: FastifyInstance) => {
		await app.register(fastifyAutoload, {
			dir: path.join(import.meta.dirname, "app"),
			cascadeHooks: true,
			// disable the automatic prefixing of the directory name to the route
			dirNameRoutePrefix: false,
			options: {},
		});
	},
	{
		name: "app-plugins",
	},
);

export default appPluginsRegistry;
