import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import { createSlug } from "@/utils/create-slug.util";

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
					avatarUrl: z.url().optional(),
				}),
				response: {
					201: z.object({
						projectId: z.uuid(),
					}),
				},
			},
			config: {
				authenticate: true,
				can: ["create", "Project"],
			},
		},
		async (
			request: FastifyRequest<{
				Params: { slug: string };
				Body: { name: string; description: string; avatarUrl: string };
			}>,
			reply: FastifyReply,
		) => {
			const { organization, currentUserId: userId } = request;
			if (!organization) {
				throw new NotFoundError("Organization not found");
			}

			const { name, description, avatarUrl } = request.body;

			const projectSlug = createSlug(name);

			const project = await prisma.project.create({
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
