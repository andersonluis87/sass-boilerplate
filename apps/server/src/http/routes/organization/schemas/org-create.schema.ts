import { z } from "zod";
import type { RouteSchema } from "@/instance.types";
import { ManageOrganizationSchema } from "@/shared/schema/organization.schema";
import { SECURITY, TAGS } from "./org.constant";

const CreateOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Create a new organization",
	security: SECURITY,
	body: ManageOrganizationSchema,
	response: {
		201: z.object({
			id: z.uuid(),
		}),
	},
};

export default CreateOrganizationRouteSchema;
