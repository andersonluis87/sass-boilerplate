import type { FastifyZodInstance } from "@/types/app-instance.type";

import PasswordRecoverRouteSchema from "./schemas/auth-password-recover.schema";
import PasswordResetRouteSchema from "./schemas/auth-password-reset.schema";
import ProfileRouteSchema from "./schemas/auth-profile.schema";
import SignInRouteSchema from "./schemas/auth-sign-in.schema";
import SignInGithubRouteSchema from "./schemas/auth-sign-in-github.schema";
import SignUpRouteSchema from "./schemas/auth-sign-up.schema";

const authenticationRoutes = (app: FastifyZodInstance) => {
	const { authenticationController: controller } = app;

	app
		.post("/auth/sign-up", {
			schema: SignUpRouteSchema,
			handler: controller.signUp.bind(controller),
		})
		.post("/auth/sign-in", {
			schema: SignInRouteSchema,
			handler: controller.signIn.bind(controller),
		})
		.post("/auth/sign-in/github", {
			schema: SignInGithubRouteSchema,
			handler: controller.signInWithGithub.bind(controller),
		})
		.get("/auth/profile", {
			schema: ProfileRouteSchema,
			config: {
				authenticate: true,
			},
			handler: controller.profile.bind(controller),
		})
		.post("/auth/password/recover", {
			schema: PasswordRecoverRouteSchema,
			handler: controller.requestPasswordRecover.bind(controller),
		})
		.post("/auth/password/reset", {
			schema: PasswordResetRouteSchema,
			handler: controller.resetPassword.bind(controller),
		});
};

export default authenticationRoutes;
