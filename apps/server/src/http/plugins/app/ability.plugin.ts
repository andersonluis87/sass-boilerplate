import type { RouteCan } from "@sass-boiler-plate/auth";
import { createAbilityFor } from "@sass-boiler-plate/auth";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";

declare module "fastify" {
	interface FastifyContextConfig {
		can?: RouteCan;
	}
}

const ability = fp(
	async (app: FastifyInstance) => {
		app.addHook("preHandler", async (request) => {
			const can = request.routeOptions.config.can;
			if (!can) {
				// Log warning for debugging purposes
				// TODO: Add a better logging system
				console.warn(
					"This route is not verified with access control",
					request.routeOptions.url,
				);
				return;
			}

			if (!request.currentUserId || !request.membership) {
				throw new UnauthorizedError("Invalid auth token");
			}

			// route must be configured with authenticate
			if (!request.routeOptions.config.authenticate) {
				throw new BadRequestError(
					"This route must be configured with authenticate property",
				);
			}

			const userAbility = createAbilityFor(
				request.currentUserId,
				request.membership?.role,
			);

			if (userAbility.cannot(...can)) {
				throw new UnauthorizedError(
					"You are not allowed to perform this action",
				);
			}
		});
	},
	{
		name: "ability",
		dependencies: ["authentication"],
	},
);

export default ability;
