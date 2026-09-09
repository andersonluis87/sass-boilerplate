import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ProjectRepository } from "@/http/routes/projects/project.repository";

declare module "fastify" {
	interface FastifyInstance {
		projectRepository: ProjectRepository;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("projectRepository", new ProjectRepository());
	},
	{
		name: "project-repository",
	},
);
