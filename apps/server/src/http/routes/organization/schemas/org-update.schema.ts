import { UpdateOrganizationSchema } from "@/shared/schema/organization.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import type { RouteSchema } from "@/types/route-schema.type";
import { Security, Tags } from "@/types/route-schema.type";

const UpdateOrganizationRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "Update an organization",
	security: [Security.bearerAuth],
	params: SlugSchema,
	body: UpdateOrganizationSchema,
	response: {
		204: NullResponseSchema,
	},
};

export default UpdateOrganizationRouteSchema;
