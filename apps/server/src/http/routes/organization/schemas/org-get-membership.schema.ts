import { Role } from "@sass-boiler-plate/auth";
import { z } from "zod";
import type { RouteSchema } from "@/instance.types";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { SECURITY, TAGS } from "./org.constant";

const GetMembershipRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "Get the current membership in an organization",
	security: SECURITY,
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
