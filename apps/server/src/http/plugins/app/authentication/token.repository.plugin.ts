import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { TokenRepository } from "@/http/routes/authentication/token.repository";

declare module "fastify" {
	interface FastifyInstance {
		tokenRepository: TokenRepository;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("tokenRepository", new TokenRepository());
	},
	{
		name: "token-repository",
	},
);
