import type { RouteSchema } from "@/instance.types";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { SECURITY, TAGS } from "./org.constant";

const ShutdownOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Shutdown an organization",
	security: SECURITY,
	params: SlugSchema,
	response: {
		204: NullResponseSchema,
	},
};

export default ShutdownOrganizationRouteSchema;
