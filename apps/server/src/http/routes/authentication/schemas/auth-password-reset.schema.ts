import { ResetPasswordSchema } from "@/shared/schema/authentication.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { type RouteSchema, Tags } from "@/types/route-schema.type";

const PasswordResetRouteSchema = {
	tags: [Tags.Authentication],
	summary: "Reset password with token",
	body: ResetPasswordSchema,
	response: {
		204: NullResponseSchema,
	},
} satisfies RouteSchema;

export default PasswordResetRouteSchema;
