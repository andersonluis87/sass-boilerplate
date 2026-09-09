import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ProjectController } from "@/http/routes/projects/project.controller";

declare module "fastify" {
	interface FastifyInstance {
		projectController: ProjectController;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate(
			"projectController",
			new ProjectController(app.projectRepository),
		);
	},
	{
		name: "project-controller",
		dependencies: ["project-repository"],
	},
);
