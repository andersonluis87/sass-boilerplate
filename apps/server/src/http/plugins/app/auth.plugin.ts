import type { Member, Organization } from "@sass-boiler-plate/db";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";

declare module "fastify" {
	interface FastifyRequest {
		currentUserId: string;
		getUserMembership: (slug: string) => Promise<{
			organization: Organization;
			membership: Member;
		}>;
	}
}

const auth = fp(
	async (app: FastifyInstance) => {
		const { memberRepository } = app;

		app.addHook("preHandler", async (request) => {
			if (request.routeOptions.config.authenticate) {
				try {
					const { sub } = await request.jwtVerify<{ sub: string }>();
					request.currentUserId = sub;
				} catch {
					throw new UnauthorizedError("Invalid auth token");
				}
			}

			request.getUserMembership = async (slug: string) => {
				if (!request.currentUserId) {
					throw new UnauthorizedError("Invalid auth token");
				}

				const member = await memberRepository.getMembership({
					userId: request.currentUserId,
					slug,
				});

				if (!member) {
					throw new UnauthorizedError(
						"You are not a member of this organization",
					);
				}

				const { organization, ...membership } = member;
				return {
					organization,
					membership,
				};
			};
		});
	},
	{
		name: "auth",
		dependencies: ["member-repository"],
	},
);

export default auth;
