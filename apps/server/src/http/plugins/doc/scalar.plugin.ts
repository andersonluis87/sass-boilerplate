import ScalarApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";

async function scalarRegistry(app: FastifyInstance) {
	// Serve an OpenAPI file for Scalar API reference
	app.get("/openapi.json", async () => {
		return app.swagger();
	});

	// Register Scalar API reference
	await app.register(ScalarApiReference, {
		routePrefix: "/reference",
		configuration: {
			metaData: {
				title: "SASS BOILER PLATE",
			},
		},
	});
}

export default fp(scalarRegistry, {
	name: "scalar",
});
