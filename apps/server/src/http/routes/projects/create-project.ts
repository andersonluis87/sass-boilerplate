import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { getUserPermissions } from "@/shared/get-user-permissions.js";
import prisma from "@sass-boiler-plate/db";

import { BadRequestError } from "@/shared/_errors/bad-request-error.js";

async function createProject(app: FastifyInstance) {
	app.post(
		"/organizations/:slug/projects",
		{
			schema: {
				tags: ["projects"],
				summary: "Create a new projects",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
				}),
				body: z.object({
					name: z.string(),
					description: z.string(),
					avatarUrl: z.string().url().optional(),
				}),
				response: {
					201: z.object({
						projectId: z.string().uuid(),
					}),
				},
			},
		},
		// controller
		async (
			request: FastifyRequest<{
				Params: { slug: string };
				Body: { name: string; description: string; avatarUrl: string };
			}>,
			reply: FastifyReply,
		) => {
			const { slug } = request.params;
			const { organization, membership } =
				await request.getUserMembership(slug);

			const userId = request.currentUserId;
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("create", "Project")) {
				throw new BadRequestError("You are not allowed to create a project");
			}

			const { name, description, avatarUrl } = request.body;

			const projectSlug = request.createSlug(name);

			// service
			const project = await prisma.projects.create({
				data: {
					name,
					slug: projectSlug,
					description,
					avatarUrl,
					organizationId: organization.id,
					ownerId: userId,
				},
			});

			reply.status(201).send({ projectId: project.id });
		},
	);
}

export default createProject;
