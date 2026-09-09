import { z } from "zod";
import { ProjectWithOwnerSchema } from "@/shared/schema/project.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const ListProjectsRouteSchema = {
	tags: [Tags.Projects],
	summary: "List projects",
	security: [Security.bearerAuth],
	params: SlugSchema,
	response: {
		200: z.object({
			projects: z.array(ProjectWithOwnerSchema),
		}),
	},
} satisfies RouteSchema;

export default ListProjectsRouteSchema;
