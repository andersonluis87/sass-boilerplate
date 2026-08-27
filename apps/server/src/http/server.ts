import { env } from "@sass-boiler-plate/env/server";
import Fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import application from "./app";

const app = Fastify({
	logger: true,
	// Apply recommended timeouts to prevent slow or idle clients from holding connections open
	connectionTimeout: 120_000,
	requestTimeout: 60_000,
	keepAliveTimeout: 10_000,
	http: {
		headersTimeout: 15_000,
	},
}).withTypeProvider<ZodTypeProvider>();

async function init() {
	await app.register(application);

	//TODO: add close with graceful shutdown
	//gracefulShutdown(app)

	await app.ready();

	app.listen({ port: env.SERVER_PORT }, (err) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
		console.log(`🚀 Server running on port ${env.SERVER_PORT}...`);
	});
}

init();
