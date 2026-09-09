import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import type { RouteSchema } from "@/types/route-schema.type";
import { Security, Tags } from "@/types/route-schema.type";

const ShutdownOrganizationRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "Shutdown an organization",
	security: [Security.bearerAuth],
	params: SlugSchema,
	response: {
		204: NullResponseSchema,
	},
};

export default ShutdownOrganizationRouteSchema;
