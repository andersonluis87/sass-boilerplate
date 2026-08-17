import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/shared/get-user-permissions.js";
import { Role } from "@sass-boiler-plate/auth";
import prisma from "@sass-boiler-plate/db";
import { BadRequestError } from "../_errors/bad-request-error.js";
import { UnauthorizedError } from "../_errors/unauthorized-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";

export async function getMembers(app: FastifyInstance) {
	protectedRoute(app).get(
		"/organizations/:organizationSlug/members",
		{
			schema: {
				tags: ["members"],
				summary: "Get all organization members",
				security: [{ bearerAuth: [] }],
				params: z.object({
					organizationSlug: z.string(),
				}),
				response: {
					200: z.object({
						members: z.array(
							z.object({
								id: z.string().uuid(),
								userId: z.string().uuid(),
								name: z.string().nullable(),
								avatarUrl: z.string().url().nullable(),
								email: z.string().email(),
								role: Role,
							}),
						),
					}),
				},
			},
		},
		// controller
		async (request, reply) => {
			const { organizationSlug } = request.params;
			const { organization, membership } =
				await request.getUserMembership(organizationSlug);

			const userId = await request.getCurrentUserId();
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("get", "User")) {
				throw new UnauthorizedError(
					"You are not allowed to see organization members",
				);
			}

			// service
			const members = await prisma.member.findMany({
				select: {
					id: true,
					role: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							avatarUrl: true,
						},
					},
				},
				where: {
					organizationId: organization.id,
				},
				orderBy: {
					role: "asc",
				},
			});

			if (!members) {
				throw new BadRequestError("Members not found");
			}

			const membersWithRoles = members.map(
				({ user: { id: userId, ...user }, ...member }) => {
					return {
						...user,
						...member,
						userId,
					};
				},
			);

			reply.status(200).send({ members: membersWithRoles });
		},
	);
}
