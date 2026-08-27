import { createContext } from "@sass-boiler-plate/api/context";
import {
	type AppRouter,
	appRouter,
} from "@sass-boiler-plate/api/routers/index";
import {
	type FastifyTRPCPluginOptions,
	fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function registerTrpc(app: FastifyInstance) {
	await app.register(fastifyTRPCPlugin, {
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

export default fp(registerTrpc, {
	name: "trpc",
});
