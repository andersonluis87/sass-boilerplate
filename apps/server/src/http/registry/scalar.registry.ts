import ScalarApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function registerScalar(app: FastifyInstance) {
	await app.register(ScalarApiReference, {
		routePrefix: "/reference",
		configuration: {
			metaData: {
				title: "SASS BOILER PLATE",
			},
		},
		// Additional hooks for the API reference routes. You can provide the onRequest and preHandler hooks
		hooks: {
			onRequest: (
				_request: FastifyRequest,
				_reply: FastifyReply,
				done: () => void,
			) => {
				done();
			},
			preHandler: (
				_request: FastifyRequest,
				_reply: FastifyReply,
				done: () => void,
			) => {
				done();
			},
		},
	});
}
