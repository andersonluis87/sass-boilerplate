import { Role } from "@sass-boiler-plate/auth";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { NotFoundError } from "@/shared/_errors/not-found-error";

async function updateMember(app: FastifyInstance) {
	const { memberRepository } = app;

	app.put(
		"/organizations/:slug/members/:memberId",
		{
			schema: {
				tags: ["members"],
				summary: "Update a member",
				security: [{ bearerAuth: [] }],
				params: z.object({
					slug: z.string(),
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
				Params: { slug: string; memberId: string };
				Body: { role: Role };
			}>,
			reply: FastifyReply,
		) => {
			const { memberId } = request.params;
			const { organization } = request;

			if (!organization) {
				throw new NotFoundError("Organization not found");
			}

			/*
			const { organization, membership } =
				await request.getCurrentUserMembership(slug);

			const userId = request.currentUserId;
			const { cannot } = checkAbilityFor(userId, membership.role);

			if (cannot("update", "User")) {
				throw new UnauthorizedError("You are not allowed update members");
			}

			*/
			const { role } = request.body;
			await memberRepository.update(memberId, {
				role,
				organizationId: organization.id,
			});

			reply.status(204).send(null);
		},
	);
}

export default updateMember;
