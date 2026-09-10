import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { AuthenticationController } from "@/http/routes/authentication/authentication.controller";

declare module "fastify" {
	interface FastifyInstance {
		authenticationController: AuthenticationController;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate(
			"authenticationController",
			new AuthenticationController(
				app.userRepository,
				app.accountRepository,
				app.tokenRepository,
				app.organizationRepository,
			),
		);
	},
	{
		name: "authentication-controller",
		dependencies: [
			"user-repository",
			"account-repository",
			"token-repository",
			"organization-repository",
		],
	},
);
