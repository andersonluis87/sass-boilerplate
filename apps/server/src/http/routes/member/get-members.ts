import { Role } from "@sass-boiler-plate/auth";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { BadRequestError } from "@/shared/_errors/bad-request-error.js";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error.js";
import { getUserPermissions } from "@/shared/get-user-permissions.js";

async function getMembers(app: FastifyInstance) {
	const { memberRepository } = app;

	app.get(
		"/organizations/:organizationSlug/members",
		{
			schema: {
				tags: ["members"],
				summary: "Get all organization members",
				security: [{ bearerAuth: [] }],
				params: z.object({
					organizationSlug: z.string(),
				}),
				response: {
					200: z.object({
						members: z.array(
							z.object({
								id: z.uuid(),
								userId: z.uuid(),
								name: z.string().nullable(),
								avatarUrl: z.url().nullable(),
								email: z.email(),
								role: Role,
							}),
						),
					}),
				},
			},
		},
		// controller
		async (
			request: FastifyRequest<{ Params: { organizationSlug: string } }>,
			reply: FastifyReply,
		) => {
			const { organizationSlug } = request.params;
			const { organization, membership } =
				await request.getUserMembership(organizationSlug);

			const userId = request.currentUserId;
			const { cannot } = getUserPermissions(userId, membership.role);

			if (cannot("get", "User")) {
				throw new UnauthorizedError(
					"You are not allowed to see organization members",
				);
			}

			// service
			const members = await memberRepository.listOrganizationMembers(
				organization.id,
			);

			if (!members) {
				throw new BadRequestError("Members not found");
			}

			const membersWithRoles = members.map(
				({ user: { id: userId, ...user }, ...member }) => {
					return {
						...user,
						...member,
						userId,
					};
				},
			);

			reply.status(200).send({ members: membersWithRoles });
		},
	);
}

export default getMembers;
