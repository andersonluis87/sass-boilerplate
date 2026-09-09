import {
	ProjectIdParamsSchema,
	UpdateProjectSchema,
} from "@/shared/schema/project.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const UpdateProjectRouteSchema = {
	tags: [Tags.Projects],
	summary: "Update a project",
	security: [Security.bearerAuth],
	params: ProjectIdParamsSchema,
	body: UpdateProjectSchema,
	response: {
		204: NullResponseSchema,
	},
} satisfies RouteSchema;

export default UpdateProjectRouteSchema;
