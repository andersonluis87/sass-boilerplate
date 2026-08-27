import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { OrganizationRepository } from "@/http/routes/organization/organization.repository";

declare module "fastify" {
	interface FastifyInstance {
		organizationRepository: OrganizationRepository;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("organizationRepository", new OrganizationRepository());
	},
	{
		name: "organization-repository",
	},
);
