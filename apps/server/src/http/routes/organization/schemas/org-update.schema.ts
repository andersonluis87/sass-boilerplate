import type { RouteSchema } from "@/instance.types";
import { UpdateOrganizationSchema } from "@/shared/schema/organization.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { SECURITY, TAGS } from "./org.constant";

const UpdateOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Update an organization",
	security: SECURITY,
	params: SlugSchema,
	body: UpdateOrganizationSchema,
	response: {
		204: NullResponseSchema,
	},
};

export default UpdateOrganizationRouteSchema;
