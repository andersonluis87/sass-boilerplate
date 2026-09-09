import type { FastifyZodInstance } from "@/types/app-instance.type";
import ListMembersRouteSchema from "./schemas/list-members.schema";
import { UpdateMemberRouteSchema } from "./schemas/update-members.schema";

const memberRoutes = (app: FastifyZodInstance) => {
	const { memberController: controller } = app;

	app
		.get("/organizations/:slug/members", {
			schema: ListMembersRouteSchema,
			config: {
				authenticate: true,
				can: ["get", "Member"],
			},
			handler: controller.list.bind(controller),
		})
		.put("/organizations/:slug/members/:memberId", {
			schema: UpdateMemberRouteSchema,
			config: {
				authenticate: true,
				can: ["update", "Member"],
			},
			handler: controller.update.bind(controller),
		});
};

export default memberRoutes;
