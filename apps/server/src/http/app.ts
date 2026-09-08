import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { errorHandler } from "./handlers/error.handler";
import appPluginsRegistry from "./plugins/app-plugins.registry";
import scalarRegistry from "./plugins/doc/scalar.plugin";
import externalPluginsRegistry from "./plugins/external-plugins.registry";
import { routesRegistry } from "./plugins/routes.registry";

async function application(app: FastifyInstance) {
	app.setSerializerCompiler(serializerCompiler);
	app.setValidatorCompiler(validatorCompiler);
	app.setErrorHandler(errorHandler);

	// App registration plugins
	await app.register(externalPluginsRegistry);
	await app.register(appPluginsRegistry);
	await app.register(routesRegistry);

	// Scalar API reference (must be registered after the routes)
	await app.register(scalarRegistry);
}

export default fp(application, {
	name: "application",
});
