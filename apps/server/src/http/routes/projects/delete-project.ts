import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
	assertWriteAllowed,
	constrainWhere,
} from "@/utils/accessible-where.util";

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
					id: z.uuid(),
				}),
				response: {
					204: z.null(),
				},
			},
			config: {
				authenticate: true,
				can: ["delete", "Project"],
			},
		},
		async (
			request: FastifyRequest<{
				Params: { slug: string; id: string };
			}>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;

			const where = constrainWhere(request, "delete", "Project", { id });
			const deleted = await prisma.project.deleteMany({ where });

			assertWriteAllowed(deleted.count);

			reply.status(204).send(null);
		},
	);
}

export default deleteProject;
