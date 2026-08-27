import fastifyCors from "@fastify/cors";
import { env } from "@sass-boiler-plate/env/server";
import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";

const corsConfig = {
	origin: env.CORS_ORIGIN,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true,
	maxAge: 86400,
};

async function registerCors(app: FastifyInstance) {
	await app.register(fastifyCors, corsConfig);
}

export default fp(registerCors, {
	name: "cors",
});
