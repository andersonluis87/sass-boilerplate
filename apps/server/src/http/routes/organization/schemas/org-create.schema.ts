import { z } from "zod";
import type { RouteSchema } from "@/instance.types";
import { CreateOrganizationSchema } from "@/shared/schema/organization.schema";
import { SECURITY, TAGS } from "./org.constant";

const CreateOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Create a new organization",
	security: SECURITY,
	body: CreateOrganizationSchema,
	response: {
		201: z.object({
			organizationId: z.uuid(),
		}),
	},
};

export default CreateOrganizationRouteSchema;
