import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/shared/get-user-permissions.js";
import prisma from "@sass-boiler-plate/db";

import { BadRequestError } from "../_errors/bad-request-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";

export async function getProject(app: FastifyInstance) {
	protectedRoute(app).get(
		"/organizations/:organizationSlug/projects/:projectSlug",
		{
			schema: {
				tags: ["projects"],
				summary: "Get project details",
				security: [{ bearerAuth: [] }],
				params: z.object({
					organizationSlug: z.string(),
					projectSlug: z.string(),
				}),
				response: {
					201: z.object({
						project: z.object({
							id: z.uuid(),
							name: z.string(),
							description: z.string().nullable(),
							slug: z.string(),
							avatarUrl: z.url().nullable(),
							owner: z.object({
								id: z.uuid(),
								name: z.string().nullable(),
								avatarUrl: z.url().nullable(),
							}),
						}),
					}),
				},
			},
		},
		// controller
		async (request, reply) => {
			const { organizationSlug, projectSlug } = request.params;
			const { organization, membership } =
				await request.getUserMembership(organizationSlug);

			const userId = await request.getCurrentUserId();
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("get", "Project")) {
				throw new BadRequestError("You are not allowed to get project details");
			}

			// service
			const project = await prisma.projects.findUnique({
				select: {
					id: true,
					name: true,
					description: true,
					slug: true,
					avatarUrl: true,
					owner: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
				where: {
					slug: projectSlug,
					organizationId: organization.id,
				},
			});

			if (!project) {
				throw new BadRequestError("Project not found");
			}

			reply.status(201).send({ project });
		},
	);
}
