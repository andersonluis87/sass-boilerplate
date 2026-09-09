import { ProjectIdParamsSchema } from "@/shared/schema/project.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const DeleteProjectRouteSchema = {
	tags: [Tags.Projects],
	summary: "Delete project",
	security: [Security.bearerAuth],
	params: ProjectIdParamsSchema,
	response: {
		204: NullResponseSchema,
	},
} satisfies RouteSchema;

export default DeleteProjectRouteSchema;
