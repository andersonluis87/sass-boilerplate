import type { RouteSchema } from "@/instance.types";
import { TransferOrganizationSchema } from "@/shared/schema/organization.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { SECURITY, TAGS } from "./org.constant";

const TransferOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Transfer organization ownership",
	security: SECURITY,
	body: TransferOrganizationSchema,
	params: SlugSchema,
	response: {
		204: NullResponseSchema,
	},
};

export default TransferOrganizationRouteSchema;
