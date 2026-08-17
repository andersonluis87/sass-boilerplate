import fastifyCors from "@fastify/cors";
import { env } from "@sass-boiler-plate/env/server";
import type { FastifyInstance } from "fastify";

const corsConfig = {
	origin: env.CORS_ORIGIN,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true,
	maxAge: 86400,
};

export function registerCors(app: FastifyInstance) {
	app.register(fastifyCors, corsConfig);
}
