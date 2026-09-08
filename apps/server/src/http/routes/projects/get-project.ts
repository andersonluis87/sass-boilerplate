import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { BadRequestError } from "@/shared/_errors/bad-request-error.js";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import { constrainWhere } from "@/utils/accessible-where.util";

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
			config: {
				authenticate: true,
				can: ["get", "Project"],
			},
		},
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

			const where = constrainWhere(request, "get", "Project", {
				slug: projectSlug,
			});

			const project = await prisma.project.findFirst({ where });
			if (!project) {
				throw new BadRequestError("Project not found");
			}

			reply.status(201).send({ project });
		},
	);
}

export default getProject;
