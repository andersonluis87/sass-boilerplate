import { Role } from "@sass-boiler-plate/auth";
import { z } from "zod";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { SlugSchema } from "@/shared/schema/slug.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const UpdateMemberParamsSchema = SlugSchema.extend({
	memberId: z.uuid(),
});

export const UpdateMemberRouteSchema = {
	tags: [Tags.Members],
	summary: "Update a member",
	security: [Security.bearerAuth],
	params: UpdateMemberParamsSchema,
	body: z.object({
		role: Role,
	}),
	response: {
		204: NullResponseSchema,
	},
} satisfies RouteSchema;

export type UpdateMemberRouteSchema = z.infer<typeof UpdateMemberParamsSchema>;
