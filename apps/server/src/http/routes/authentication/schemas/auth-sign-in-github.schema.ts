import {
	AuthTokenSchema,
	GithubCodeSchema,
} from "@/shared/schema/authentication.schema";
import { type RouteSchema, Tags } from "@/types/route-schema.type";

const SignInGithubRouteSchema = {
	tags: [Tags.Authentication],
	summary: "Authenticate with GitHub",
	body: GithubCodeSchema,
	response: {
		201: AuthTokenSchema,
	},
} satisfies RouteSchema;

export default SignInGithubRouteSchema;
