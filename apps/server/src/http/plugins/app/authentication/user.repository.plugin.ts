import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UserRepository } from "@/http/routes/authentication/user.repository";

declare module "fastify" {
	interface FastifyInstance {
		userRepository: UserRepository;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("userRepository", new UserRepository());
	},
	{
		name: "user-repository",
	},
);
