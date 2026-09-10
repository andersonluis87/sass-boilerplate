import { RequestPasswordRecoverSchema } from "@/shared/schema/authentication.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { type RouteSchema, Tags } from "@/types/route-schema.type";

const PasswordRecoverRouteSchema = {
	tags: [Tags.Authentication],
	summary: "Request password token to reset password",
	body: RequestPasswordRecoverSchema,
	response: {
		201: NullResponseSchema,
	},
} satisfies RouteSchema;

export default PasswordRecoverRouteSchema;
