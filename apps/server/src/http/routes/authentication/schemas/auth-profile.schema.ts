import { z } from "zod";
import { MessageResponseSchema } from "@/shared/schema/response.schema";
import { UserProfileSchema } from "@/shared/schema/user.schema";
import { type RouteSchema, Security, Tags } from "@/types/route-schema.type";

const ProfileRouteSchema = {
	tags: [Tags.Authentication],
	summary: "Get authenticated user profile",
	security: [Security.bearerAuth],
	response: {
		200: z.object({
			user: UserProfileSchema,
		}),
		404: MessageResponseSchema,
	},
} satisfies RouteSchema;

export default ProfileRouteSchema;
