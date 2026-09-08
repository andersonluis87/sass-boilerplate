import { Role } from "@sass-boiler-plate/auth";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import {
	assertWriteAllowed,
	constrainWhere,
} from "@/utils/accessible-where.util";

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
			config: {
				authenticate: true,
				can: ["update", "Member"],
			},
		},
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

			const { role } = request.body;
			const where = constrainWhere(request, "update", "Member", {
				id: memberId,
			});
			const updated = await memberRepository.update(where, { role });
			assertWriteAllowed(updated.count);

			reply.status(204).send(null);
		},
	);
}

export default updateMember;
