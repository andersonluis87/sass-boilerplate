import { AuthTokenSchema, SignInSchema } from "@/shared/schema/authentication.schema";
import { type RouteSchema, Tags } from "@/types/route-schema.type";

const SignInRouteSchema = {
	tags: [Tags.Authentication],
	summary: "Authenticate with e-mail and password",
	body: SignInSchema,
	response: {
		201: AuthTokenSchema,
	},
} satisfies RouteSchema;

export default SignInRouteSchema;
