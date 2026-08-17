import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { auth } from "@/http/middlewares/auth.middleware.js";

export function route(app: FastifyInstance) {
	return app.withTypeProvider<ZodTypeProvider>();
}

export function protectedRoute(app: FastifyInstance) {
	return route(app).register(auth);
}
