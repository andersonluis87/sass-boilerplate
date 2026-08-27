import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import prisma from "@sass-boiler-plate/db";
import { getUserPermissions } from "@/shared/get-user-permissions.js";

import { BadRequestError } from "@/shared/_errors/bad-request-error.js";

async function getProjects(app: FastifyInstance) {
	app.get(
		"/organizations/:slug/projects",
		{
			schema: {
				tags: ["projects"],
				summary: "Get projects",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
				}),
				response: {
					200: z.object({
						projects: z.array(
							z.object({
								id: z.uuid(),
								name: z.string(),
								description: z.string().nullable(),
								slug: z.string(),
								avatarUrl: z.url().nullable(),
								createdAt: z.date(),
								owner: z.object({
									id: z.uuid(),
									name: z.string().nullable(),
									avatarUrl: z.url().nullable(),
								}),
							}),
						),
					}),
				},
			},
		},
		// controller
		async (
			request: FastifyRequest<{ Params: { slug: string } }>,
			reply: FastifyReply,
		) => {
			const { slug } = request.params;
			const { organization, membership } =
				await request.getUserMembership(slug);

			const userId = request.currentUserId;
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("get", "Project")) {
				throw new BadRequestError("You are not allowed to get projects");
			}

			// service
			const projects = await prisma.projects.findMany({
				select: {
					id: true,
					name: true,
					description: true,
					slug: true,
					avatarUrl: true,
					createdAt: true,
					owner: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
				where: {
					organizationId: organization.id,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			if (!projects) {
				throw new BadRequestError("Project not found");
			}

			reply.status(200).send({ projects });
		},
	);
}

export default getProjects;
