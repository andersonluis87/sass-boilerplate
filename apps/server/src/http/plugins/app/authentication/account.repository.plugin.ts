import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { AccountRepository } from "@/http/routes/authentication/account.repository";

declare module "fastify" {
	interface FastifyInstance {
		accountRepository: AccountRepository;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("accountRepository", new AccountRepository());
	},
	{
		name: "account-repository",
	},
);
