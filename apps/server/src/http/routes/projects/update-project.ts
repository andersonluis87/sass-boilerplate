import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import {
	assertWriteAllowed,
	constrainWhere,
} from "@/utils/accessible-where.util";

async function updateProject(app: FastifyInstance) {
	app.patch(
		"/organizations/:slug/projects/:id",
		{
			schema: {
				tags: ["projects"],
				summary: "Update a project",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
					id: z.uuid(),
				}),
				body: z
					.object({
						name: z.string(),
						description: z.string(),
						avatarUrl: z.url(),
					})
					.strict()
					.partial(),
				response: {
					204: z.null(),
				},
			},
			config: {
				authenticate: true,
				can: ["update", "Project"],
			},
		},
		async (
			request: FastifyRequest<{
				Params: { slug: string; id: string };
				Body: { name: string; description: string; avatarUrl: string };
			}>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;
			const { organization } = request;
			if (!organization) {
				throw new NotFoundError("Organization not found");
			}

			const { name, description } = request.body;
			const where = constrainWhere(request, "update", "Project", { id });

			const updated = await prisma.project.updateMany({
				data: {
					name,
					description,
				},
				where,
			});

			assertWriteAllowed(updated.count);

			reply.status(204).send(null);
		},
	);
}

export default updateProject;
