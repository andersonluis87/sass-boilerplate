import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { OrganizationController } from "@/http/routes/organization/organization.controller";

declare module "fastify" {
	interface FastifyInstance {
		organizationController: OrganizationController;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate(
			"organizationController",
			new OrganizationController(
				app.organizationRepository,
				app.memberRepository,
			),
		);
	},
	{
		name: "organization-controller",
		dependencies: ["organization-repository", "member-repository"],
	},
);
