import path from "node:path";
import fastifyAutoload from "@fastify/autoload";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export const routesRegistry = fp(
	async (app: FastifyInstance, options: FastifyPluginOptions) => {
		await app.register(fastifyAutoload, {
			dir: path.resolve(import.meta.dirname, "../routes"),
			autoHooks: true,
			cascadeHooks: true,
			// disable the automatic prefixing of the directory name to the route
			dirNameRoutePrefix: false,
			options: { ...options },
		});
	},
	{
		name: "routes",
		dependencies: ["app-plugins"],
	},
);
