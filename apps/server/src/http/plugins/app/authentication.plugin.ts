import type { Member, Organization } from "@sass-boiler-plate/db";
import type { FastifyInstance } from "fastify";
import type { FastifyRequest } from "fastify/types/request";
import fp from "fastify-plugin";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";
import { getSlug } from "@/utils/get-slug.util";

declare module "fastify" {
	interface FastifyContextConfig {
		authenticate?: boolean;
	}

	interface FastifyRequest {
		currentUserId: string;
		membership: Member;
		organization: Organization;
		getCurrentUserMembership: (slug: string) => Promise<void>;
	}
}

const membershipCache = new Map<
	string,
	{
		organization: Organization;
		membership: Member;
	}
>();

const getMembershipFromCache = async (slug: string, userId: string) => {
	const cachedMembership = membershipCache.get(`${slug}:${userId}`);
	if (cachedMembership) {
		return cachedMembership;
	}
};

const authentication = fp(
	async (app: FastifyInstance) => {
		app.decorateRequest<string>("currentUserId", "");
		app.decorateRequest<Member | null>("membership", null);
		app.decorateRequest<Organization | null>("organization", null);

		app.decorateRequest(
			"getCurrentUserMembership",
			async function (this: FastifyRequest, slug: string) {
				const { memberRepository } = app;

				try {
					const { currentUserId: userId } = this;

					// Handle cached membership first
					const cachedMembership = await getMembershipFromCache(slug, userId);
					if (cachedMembership) {
						this.membership = cachedMembership.membership;
						this.organization = cachedMembership.organization;
						return;
					}

					// If not cached, then fetch membership from database
					const member = await memberRepository.getMembership({
						userId,
						slug,
					});

					// If not found, then throw unauthorized error
					// we don't want to expose the existence of the organization
					if (!member) {
						throw new UnauthorizedError(
							"You are not a member of this organization",
						);
					}

					const { organization, ...membership } = member;

					// Cache membership for future requests
					membershipCache.set(`${slug}:${this.currentUserId}`, {
						organization,
						membership,
					});

					// Hydrate request with membership and organization
					this.membership = membership;
					this.organization = organization;

					return;
				} catch (error) {
					// Log error for debugging purposes
					// TODO: Add a better logging system
					console.error(error);
					throw error;
				}
			},
		);

		app.addHook("preHandler", async (request) => {
			if (request.routeOptions.config.authenticate) {
				try {
					const { sub } = await request.jwtVerify<{ sub: string }>();

					// hydrate request with current user id
					request.currentUserId = sub;
				} catch (error) {
					console.error(error);
					throw new UnauthorizedError("Invalid auth token");
				}

				// hydrate membership and organization if slug is provided
				const slug = getSlug(request.params);
				if (slug) {
					await request.getCurrentUserMembership(slug);
				}
			}
		});
	},
	{
		name: "authentication",
		dependencies: ["member-repository"],
	},
);

export default authentication;
