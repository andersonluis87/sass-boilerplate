import { createContext } from "@sass-boiler-plate/api/context";
import {
	appRouter,
	type AppRouter,
} from "@sass-boiler-plate/api/routers/index";
import {
	fastifyTRPCPlugin,
	type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";

export function registerTrpc(app: FastifyInstance) {
	app.register(fastifyTRPCPlugin, {
		prefix: "/trpc",
		trpcOptions: {
			router: appRouter,
			createContext,
			onError({ path, error }) {
				console.error(`Error in tRPC handler on path '${path}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
	});
}
