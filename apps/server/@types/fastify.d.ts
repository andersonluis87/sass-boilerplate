import "fastify";

import type { RouteCan } from "@packages/auth";

declare module "fastify" {
	interface FastifyContextConfig {
		authenticate?: boolean;
		can?: RouteCan;
	}

	interface FastifyInstance {
		createSlug: (name: string) => string;
	}
}
