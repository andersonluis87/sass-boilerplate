import { z } from "zod";
import { ManageProjectSchema } from "@/shared/schema/project.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const CreateProjectRouteSchema = {
	tags: [Tags.Projects],
	summary: "Create a new project",
	security: [Security.bearerAuth],
	params: SlugSchema,
	body: ManageProjectSchema,
	response: {
		201: z.object({
			projectId: z.uuid(),
		}),
	},
} satisfies RouteSchema;

export default CreateProjectRouteSchema;
