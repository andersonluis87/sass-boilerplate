import type { FastifyZodInstance } from "@/instance.types";

import CreateOrganizationRouteSchema from "./schemas/org-create.schema";
import GetOrganizationRouteSchema from "./schemas/org-get.schema";
import GetMembershipRouteSchema from "./schemas/org-get-membership.schema";
import ListOrganizationRouteSchema from "./schemas/org-list.schema";
import ShutdownOrganizationRouteSchema from "./schemas/org-shutdown.schema";
import TransferOrganizationRouteSchema from "./schemas/org-transfer.schema";
import UpdateOrganizationRouteSchema from "./schemas/org-update.schema";

const organizationRoutes = (app: FastifyZodInstance) => {
	const { organizationController: controller } = app;

	//TODO: Add authentication and authorization (per route)
	app
		.get("/organizations", {
			schema: ListOrganizationRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.list.bind(controller),
		})
		.get("/organizations/:slug", {
			schema: GetOrganizationRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.get.bind(controller),
		})
		.get("/organizations/:slug/membership", {
			schema: GetMembershipRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.getMembership.bind(controller),
		})
		.post("/organizations", {
			schema: CreateOrganizationRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.create.bind(controller),
		})
		.delete("/organizations/:slug", {
			schema: ShutdownOrganizationRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.shutdown.bind(controller),
		})
		.patch("/organizations/:slug/onwer", {
			schema: TransferOrganizationRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.transfer.bind(controller),
		})
		.patch("/organizations/:slug", {
			schema: UpdateOrganizationRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.update.bind(controller),
		});
};

export default organizationRoutes;
