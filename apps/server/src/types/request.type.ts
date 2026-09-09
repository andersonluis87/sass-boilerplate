import type {
	FastifyRequest,
	FastifySchema,
	RawRequestDefaultExpression,
	RawServerDefault,
	RouteGenericInterface,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export type ZodTypedRequest<Schema extends FastifySchema> = FastifyRequest<
	RouteGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression,
	Schema,
	ZodTypeProvider
>;
