import { ProjectSchema } from "@sass-boiler-plate/auth";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import prisma from "@sass-boiler-plate/db";
import { getUserPermissions } from "@/shared/get-user-permissions.js";

import { BadRequestError } from "../_errors/bad-request-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";

export async function updateProject(app: FastifyInstance) {
	protectedRoute(app).patch(
		"/organizations/:slug/projects/:id",
		{
			schema: {
				tags: ["projects"],
				summary: "Update a project",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
					id: z.string().uuid(),
				}),
				body: z
					.object({
						name: z.string(),
						description: z.string(),
						avatarUrl: z.string().url(),
					})
					.strict()
					.partial(),
				response: {
					204: z.null(),
				},
			},
		},
		// controller
		async (request, reply) => {
			const { slug, id } = request.params;
			const { organization, membership } =
				await request.getUserMembership(slug);

			const project = await prisma.projects.findUnique({
				where: {
					id,
					organizationId: organization.id,
				},
			});

			if (!project) {
				throw new BadRequestError("Project not found");
			}

			const userId = await request.getCurrentUserId();
			const { cannot } = getUserPermissions(userId, membership.role);
			const authProject = ProjectSchema.parse(project);

			if (cannot("update", authProject)) {
				throw new BadRequestError("You are not allowed to update this project");
			}

			const { name, description } = request.body;

			await prisma.projects.update({
				data: {
					name,
					description,
				},
				where: {
					id,
				},
			});

			reply.status(204).send(null);
		},
	);
}
