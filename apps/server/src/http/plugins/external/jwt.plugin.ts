import fastifyJwt from "@fastify/jwt";
import { env } from "@sass-boiler-plate/env/server";
import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";

async function registerJwt(app: FastifyInstance) {
	await app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
	});
}

export default fp(registerJwt, {
	name: "jwt",
});
