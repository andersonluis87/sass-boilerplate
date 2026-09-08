import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { BadRequestError } from "@/shared/_errors/bad-request-error.js";
import { NotFoundError } from "@/shared/_errors/not-found-error";

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
		},
		// controller
		async (
			request: FastifyRequest<{
				Params: { slug: string; id: string };
			}>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;
			const { organization } = request;
			if (!organization) {
				throw new NotFoundError("Organization not found");
			}

			const project = await prisma.projects.findUnique({
				where: {
					id,
					organizationId: organization.id,
				},
			});

			if (!project) {
				throw new BadRequestError("Project not found");
			}

			/*const userId = request.currentUserId;
			
			const { cannot } = checkAbilityFor(userId, membership.role);
			const authProject = ProjectSchema.parse(project);

			if (cannot("delete", authProject)) {
				throw new BadRequestError("You are not allowed to remove this project");
			}
			*/

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
