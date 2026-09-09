import type { FastifyZodInstance } from "@/types/app-instance.type";

import CreateProjectRouteSchema from "./schemas/project-create.schema";
import DeleteProjectRouteSchema from "./schemas/project-delete.schema";
import GetProjectRouteSchema from "./schemas/project-get.schema";
import ListProjectsRouteSchema from "./schemas/project-list.schema";
import UpdateProjectRouteSchema from "./schemas/project-update.schema";

const projectRoutes = (app: FastifyZodInstance) => {
	const { projectController: controller } = app;

	app
		.get("/organizations/:slug/projects", {
			schema: ListProjectsRouteSchema,
			config: {
				authenticate: true,
				can: ["get", "Project"],
			},
			handler: controller.list.bind(controller),
		})
		.get("/organizations/:slug/projects/:projectSlug", {
			schema: GetProjectRouteSchema,
			config: {
				authenticate: true,
				can: ["get", "Project"],
			},
			handler: controller.get.bind(controller),
		})
		.post("/organizations/:slug/projects", {
			schema: CreateProjectRouteSchema,
			config: {
				authenticate: true,
				can: ["create", "Project"],
			},
			handler: controller.create.bind(controller),
		})
		.patch("/organizations/:slug/projects/:id", {
			schema: UpdateProjectRouteSchema,
			config: {
				authenticate: true,
				can: ["update", "Project"],
			},
			handler: controller.update.bind(controller),
		})
		.delete("/organizations/:slug/projects/:id", {
			schema: DeleteProjectRouteSchema,
			config: {
				authenticate: true,
				can: ["delete", "Project"],
			},
			handler: controller.delete.bind(controller),
		});
};

export default projectRoutes;
