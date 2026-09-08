import { z } from "zod";
import type { RouteSchema } from "@/instance.types";
import { OrganizationBaseSchema } from "@/shared/schema/organization.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { SECURITY, TAGS } from "./org.constant";

const GetOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Get an organization",
	description: "Get an organization by its slug",
	security: SECURITY,
	params: SlugSchema,
	response: {
		200: z.object({
			organization: OrganizationBaseSchema,
		}),
	},
};

export default GetOrganizationRouteSchema;
