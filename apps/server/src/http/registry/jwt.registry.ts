import fastifyJwt from "@fastify/jwt";
import { env } from "@sass-boiler-plate/env/server";
import type { FastifyInstance } from "fastify";

export function registerJwt(app: FastifyInstance) {
	app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
	});
}
