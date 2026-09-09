import { z } from "zod";
import { OrganizationBaseSchema } from "@/shared/schema/organization.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import type { RouteSchema } from "@/types/route-schema.type";
import { Security, Tags } from "@/types/route-schema.type";

const GetOrganizationRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "Get an organization",
	description: "Get an organization by its slug",
	security: [Security.bearerAuth],
	params: SlugSchema,
	response: {
		200: z.object({
			organization: OrganizationBaseSchema,
		}),
	},
};

export default GetOrganizationRouteSchema;
