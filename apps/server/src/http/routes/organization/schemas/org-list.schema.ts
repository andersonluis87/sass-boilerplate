import { Role } from "@sass-boiler-plate/auth";
import { z } from "zod";
import { OrganizationBaseSchema } from "@/shared/schema/organization.schema";
import type { RouteSchema } from "@/types/route-schema.type";
import { Security, Tags } from "@/types/route-schema.type";

const ListOrganizationRouteSchema: RouteSchema = {
	tags: [Tags.Organizations],
	summary: "List organizations",
	security: [Security.bearerAuth],
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
