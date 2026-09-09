import { Role } from "@sass-boiler-plate/auth";
import { z } from "zod";
import { SlugSchema } from "@/shared/schema/slug.schema";
import type { RouteSchema } from "@/types/route-schema.type";
import { Security, Tags } from "@/types/route-schema.type";

const GetMembershipRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "Get the current membership in an organization",
	security: [Security.bearerAuth],
	params: SlugSchema,
	response: {
		200: z.object({
			membership: z.object({
				id: z.uuid(),
				role: Role,
				organizationId: z.uuid(),
			}),
		}),
	},
};

export default GetMembershipRouteSchema;
