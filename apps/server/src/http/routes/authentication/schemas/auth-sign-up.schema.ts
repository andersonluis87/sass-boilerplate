import { SignUpSchema } from "@/shared/schema/authentication.schema";
import { NullResponseSchema } from "@/shared/schema/response.schema";
import { type RouteSchema, Tags } from "@/types/route-schema.type";

const SignUpRouteSchema = {
	tags: [Tags.Authentication],
	summary: "Create a new account",
	body: SignUpSchema,
	response: {
		201: NullResponseSchema,
	},
} satisfies RouteSchema;

export default SignUpRouteSchema;
