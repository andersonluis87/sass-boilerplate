import { Role } from "@sass-boiler-plate/auth";
import { z } from "zod";
import type { RouteSchema } from "@/instance.types";
import { OrganizationBaseSchema } from "@/shared/schema/organization.schema";
import { SECURITY, TAGS } from "./org.constant";

const ListOrganizationRouteSchema: RouteSchema = {
	tags: TAGS,
	summary: "List organizations",
	security: SECURITY,
	description: "List organizations where the current user is a member",
	response: {
		200: z.object({
			organizations: z.array(
				OrganizationBaseSchema.pick({
					id: true,
					name: true,
					slug: true,
					avatarUrl: true,
				}).extend({
					role: Role,
				}),
			),
		}),
	},
};

export default ListOrganizationRouteSchema;
