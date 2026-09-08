import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { BadRequestError } from "@/shared/_errors/bad-request-error.js";
import { NotFoundError } from "@/shared/_errors/not-found-error";

async function getProject(app: FastifyInstance) {
	app.get(
		"/organizations/:slug/projects/:projectSlug",
		{
			schema: {
				tags: ["projects"],
				summary: "Get project details",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
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
		async (
			request: FastifyRequest<{
				Params: { slug: string; projectSlug: string };
			}>,
			reply: FastifyReply,
		) => {
			const { projectSlug } = request.params;
			const { organization } = request;
			if (!organization) {
				throw new NotFoundError("Organization not found");
			}

			/*
			const { organization, membership } =
				await request.getCurrentUserMembership(slug);

			const userId = request.currentUserId;
			const { cannot } = checkAbilityFor(userId, membership.role);

			if (cannot("get", "Project")) {
				throw new BadRequestError("You are not allowed to get project details");
			}
			*/

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

export default getProject;
