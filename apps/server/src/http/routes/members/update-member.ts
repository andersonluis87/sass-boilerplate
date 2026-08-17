import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/shared/get-user-permissions.js";
import { Role } from "@sass-boiler-plate/auth";
import { UnauthorizedError } from "../_errors/unauthorized-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";
import prisma from "@sass-boiler-plate/db";

export async function updateMember(app: FastifyInstance) {
	protectedRoute(app).put(
		"/organizations/:organizationSlug/members/:memberId",
		{
			schema: {
				tags: ["members"],
				summary: "Update a member",
				security: [{ bearerAuth: [] }],
				params: z.object({
					organizationSlug: z.string(),
					memberId: z.string().uuid(),
				}),
				body: z.object({
					role: Role,
				}),
				response: {
					204: z.null(),
				},
			},
		},
		// controller
		async (request, reply) => {
			const { organizationSlug, memberId } = request.params;
			const { organization, membership } =
				await request.getUserMembership(organizationSlug);

			const userId = await request.getCurrentUserId();
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("update", "User")) {
				throw new UnauthorizedError("You are not allowed update members");
			}

			const { role } = request.body;

			await prisma.member.update({
				where: {
					id: memberId,
					organizationId: organization.id,
				},
				data: {
					role,
				},
			});

			reply.status(204).send(null);
		},
	);
}
