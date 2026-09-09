import { z } from "zod";
import {
	ProjectSlugParamsSchema,
	ProjectWithOwnerSchema,
} from "@/shared/schema/project.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const GetProjectRouteSchema = {
	tags: [Tags.Projects],
	summary: "Get project details",
	security: [Security.bearerAuth],
	params: ProjectSlugParamsSchema,
	response: {
		200: z.object({
			project: ProjectWithOwnerSchema,
		}),
	},
} satisfies RouteSchema;

export default GetProjectRouteSchema;
