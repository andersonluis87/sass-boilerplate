import type { AppAbility, RouteCan } from "@sass-boiler-plate/auth";
import { createAbilityFor } from "@sass-boiler-plate/auth";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";

declare module "fastify" {
	interface FastifyContextConfig {
		can?: RouteCan;
	}

	interface FastifyRequest {
		ability?: AppAbility;
	}
}

const ability = fp(
	async (app: FastifyInstance) => {
		app.addHook("preHandler", async (request) => {
			const can = request.routeOptions.config.can;

			if (request.routeOptions.config.authenticate && request.membership) {
				request.ability = createAbilityFor(
					request.currentUserId,
					request.membership.role,
				);
			}

			if (!can) {
				console.warn(
					"This route is not verified with access control",
					request.routeOptions.url,
				);
				return;
			}

			if (!request.routeOptions.config.authenticate) {
				throw new BadRequestError(
					"This route must be configured with authenticate property",
				);
			}

			if (!request.ability) {
				throw new UnauthorizedError("Invalid auth token");
			}

			if (request.ability.cannot(can[0], can[1])) {
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
