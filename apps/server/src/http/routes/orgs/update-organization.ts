import type { FastifyInstance } from "fastify";
import { z } from "zod";

import prisma from "@sass-boiler-plate/db";
import { getUserPermissions } from "@/shared/get-user-permissions.js";

import { BadRequestError } from "../_errors/bad-request-error.js";
import { UnauthorizedError } from "../_errors/unauthorized-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";
import { OrganizationSchema } from "@sass-boiler-plate/auth";

export async function updateOrganization(app: FastifyInstance) {
	protectedRoute(app).patch(
		"/organizations/:slug",
		{
			schema: {
				tags: ["organizations"],
				summary: "Update an organization",
				security: [{ bearerAuth: [] }],
				body: z
					.object({
						name: z.string(),
						domain: z.string().url(),
						shouldAttachUsersByDomain: z.boolean().default(false),
					})
					.partial()
					.strict(),
				params: z.object({
					slug: z.string(),
				}),
				response: {
					204: z.null(),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const userId = await request.getCurrentUserId();
			const {
				membership: { role },
				organization,
			} = await request.getUserMembership(slug);

			const { name, domain, shouldAttachUsersByDomain } = request.body;
			const authOrganization = OrganizationSchema.parse(organization);

			const { cannot } = getUserPermissions(userId, role);

			if (cannot("update", authOrganization)) {
				throw new UnauthorizedError(
					"You are not allowed to update this organization",
				);
			}

			if (domain) {
				const organizationExistsByDomain = await prisma.organization.findFirst({
					where: {
						domain,
						slug: {
							not: slug,
						},
					},
				});

				if (organizationExistsByDomain) {
					throw new BadRequestError(
						"Organization with this domain already exists",
					);
				}
			}

			await prisma.organization.update({
				where: {
					id: organization.id,
				},
				data: {
					name,
					domain,
					shouldAttachUsersByDomain,
				},
			});

			return reply.status(204).send(null);
		},
	);
}
