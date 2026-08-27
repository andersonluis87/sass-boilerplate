import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/shared/get-user-permissions.js";
import { ProjectSchema } from "@sass-boiler-plate/auth";
import prisma from "@sass-boiler-plate/db";
import { BadRequestError } from "@/shared/_errors/bad-request-error.js";

async function deleteProject(app: FastifyInstance) {
	app.delete(
		"/organizations/:slug/projects/:id",
		{
			schema: {
				tags: ["projects"],
				summary: "Delete project",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
					id: z.string().uuid(),
				}),
				response: {
					204: z.null(),
				},
			},
		},
		// controller
		async (
			request: FastifyRequest<{
				Params: { slug: string; id: string };
			}>,
			reply: FastifyReply,
		) => {
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

			const userId = request.currentUserId;
			const { cannot } = getUserPermissions(userId, membership.role);
			const authProject = ProjectSchema.parse(project);

			if (cannot("delete", authProject)) {
				throw new BadRequestError("You are not allowed to remove this project");
			}

			await prisma.projects.delete({
				where: {
					id,
				},
			});

			reply.status(204).send(null);
		},
	);
}

export default deleteProject;
