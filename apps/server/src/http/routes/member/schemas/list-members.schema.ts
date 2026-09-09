import { Role } from "@sass-boiler-plate/auth";
import { z } from "zod";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const ListMembersRouteSchema = {
	tags: [Tags.Members],
	summary: "Get all organization members",
	security: [Security.bearerAuth],
	params: z.object({
		slug: z.string(),
	}),
	response: {
		200: z.object({
			members: z.array(
				z.object({
					id: z.uuid(),
					userId: z.uuid(),
					name: z.string().nullable(),
					avatarUrl: z.url().nullable(),
					email: z.email(),
					role: Role,
				}),
			),
		}),
	},
} satisfies RouteSchema;

export default ListMembersRouteSchema;
