import { Role } from "@sass-boiler-plate/auth";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error.js";
import { getUserPermissions } from "@/shared/get-user-permissions.js";

async function updateMember(app: FastifyInstance) {
	const { memberRepository } = app;

	app.put(
		"/organizations/:organizationSlug/members/:memberId",
		{
			schema: {
				tags: ["members"],
				summary: "Update a member",
				security: [{ bearerAuth: [] }],
				params: z.object({
					organizationSlug: z.string(),
					memberId: z.uuid(),
				}),
				body: z.object({
					role: Role,
				}),
				response: {
					204: z.null(),
				},
			},
		},
		// controller
		async (
			request: FastifyRequest<{
				Params: { organizationSlug: string; memberId: string };
				Body: { role: Role };
			}>,
			reply: FastifyReply,
		) => {
			const { organizationSlug, memberId } = request.params;
			const { organization, membership } =
				await request.getUserMembership(organizationSlug);

			const userId = request.currentUserId;
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("update", "User")) {
				throw new UnauthorizedError("You are not allowed update members");
			}

			const { role } = request.body;
			await memberRepository.update({
				id: memberId,
				role,
				organizationId: organization.id,
			});

			reply.status(204).send(null);
		},
	);
}

export default updateMember;
