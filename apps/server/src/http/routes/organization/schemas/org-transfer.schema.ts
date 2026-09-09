import { TransferOrganizationSchema } from "@/shared/schema/organization.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const TransferOrganizationRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "Transfer organization ownership",
	security: [Security.bearerAuth],
	body: TransferOrganizationSchema,
	params: SlugSchema,
	response: {
		204: NullResponseSchema,
	},
};

export default TransferOrganizationRouteSchema;
