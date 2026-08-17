import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "@sass-boiler-plate/env/server";
import Fastify from "fastify";
import { errorHandler } from "./handlers/error.handler.js";
import { registerCors } from "./registry/cors.registry.js";
import { registerJwt } from "./registry/jwt.registry.js";
import { registerScalar } from "./registry/scalar.registry.js";
import { registerSwagger } from "./registry/swagger.registry.js";
import { registerTrpc } from "./registry/trpc.registry.js";
import { registerRoutes } from "./routes/register-routes.js";

const app = Fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

// app configs
registerSwagger(app);
registerJwt(app);
registerCors(app);
registerTrpc(app);

// routes
registerRoutes(app);

// Serve an OpenAPI file
app.get("/openapi.json", async () => {
	return app.swagger();
});

// Scalar API reference
await registerScalar(app);

// Wait for Fastify to be ready
await app.ready();

app.listen({ port: env.SERVER_PORT }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	console.log(`🚀 Server running on port ${env.SERVER_PORT}...`);
});
