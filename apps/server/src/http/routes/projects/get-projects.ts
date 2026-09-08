import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import { constrainWhere } from "@/utils/accessible-where.util";

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
			config: {
				authenticate: true,
				can: ["get", "Project"],
			},
		},
		async (
			request: FastifyRequest<{ Params: { slug: string } }>,
			reply: FastifyReply,
		) => {
			const { organization } = request;
			if (!organization) {
				throw new NotFoundError("Organization not found");
			}

			const where = constrainWhere(request, "get", "Project");
			const projects = await prisma.project.findMany({
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
				where,
				orderBy: {
					createdAt: "desc",
				},
			});

			reply.status(200).send({ projects });
		},
	);
}

export default getProjects;
