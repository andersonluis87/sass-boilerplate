import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// API and DB configuration
		SERVER_PORT: z.coerce.number().default(3333),
		CORS_ORIGIN: z.url(),
		DATABASE_URL: z.url(),

		// Auth
		JWT_SECRET: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		GITHUB_REDIRECT_URI: z.url(),

		// Logging
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
