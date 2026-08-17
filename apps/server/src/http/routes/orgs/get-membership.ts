import type { FastifyInstance } from "fastify";
import z from "zod";

import { Role } from "@sass-boiler-plate/auth";
import { protectedRoute } from "../fastify-zod-route-provider.js";

export async function getMembership(app: FastifyInstance) {
	protectedRoute(app).get(
		"/organizations/:slug/membership",
		{
			schema: {
				tags: ["organizations"],
				summary: "Get the current user membership in an organization",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
				}),
				response: {
					200: z.object({
						membership: z.object({
							id: z.uuid(),
							role: Role,
							organizationId: z.uuid(),
						}),
					}),
				},
			},
		},
		async (request) => {
			const { slug } = request.params;
			const {
				membership: { id, role, organizationId },
			} = await request.getUserMembership(slug);

			return {
				membership: {
					id,
					role,
					organizationId,
				},
			};
		},
	);
}
