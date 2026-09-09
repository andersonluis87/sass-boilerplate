import { z } from "zod";
import { ManageOrganizationSchema } from "@/shared/schema/organization.schema";
import type { RouteSchema } from "@/types/route-schema.type";
import { Security, Tags } from "@/types/route-schema.type";

const CreateOrganizationRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "Create a new organization",
	security: [Security.bearerAuth],
	body: ManageOrganizationSchema,
	response: {
		201: z.object({
			id: z.uuid(),
		}),
	},
};

export default CreateOrganizationRouteSchema;
