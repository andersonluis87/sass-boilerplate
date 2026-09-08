import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { createJsonSchemaTransform } from "fastify-type-provider-zod";

const jsonSchemaTransform = createJsonSchemaTransform({
	zodToJsonConfig: {
		override: ({ jsonSchema }) => {
			if (jsonSchema.format === "uuid") {
				delete jsonSchema.pattern;
			}
		},
	},
});

async function registerSwagger(app: FastifyInstance) {
	await app.register(fastifySwagger, {
		openapi: {
			info: {
				title: "SASS BOILER PLATE",
				description: "Boilerplate for SASS, and RBAC",
				version: "1.0.0",
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
		transform: jsonSchemaTransform,
	});

	await app.register(fastifySwaggerUI, {
		routePrefix: "/docs",
	});
}

export default fp(registerSwagger, {
	name: "swagger",
});
