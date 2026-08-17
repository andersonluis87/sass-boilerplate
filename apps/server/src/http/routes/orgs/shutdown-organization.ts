import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/shared/get-user-permissions.js";
import prisma from "@sass-boiler-plate/db";

import { OrganizationSchema } from "@sass-boiler-plate/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";

export async function shutdownOrganization(app: FastifyInstance) {
	protectedRoute(app).delete(
		"/organizations/:slug",
		{
			schema: {
				tags: ["organizations"],
				summary: "Shutdown an organization",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
				}),
				response: {
					204: z.null(),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const userId = await request.getCurrentUserId();
			const {
				membership: { role },
				organization,
			} = await request.getUserMembership(slug);
			const authOrganization = OrganizationSchema.parse(organization);

			const { cannot } = getUserPermissions(userId, role);

			if (cannot("delete", authOrganization)) {
				throw new UnauthorizedError(
					"You are not allowed to shutdown this organization",
				);
			}

			await prisma.organization.delete({
				where: {
					id: organization.id,
				},
			});

			return reply.status(204).send(null);
		},
	);
}
