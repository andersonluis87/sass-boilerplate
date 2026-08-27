import type {
	FastifyBaseLogger,
	FastifyInstance,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
	RouteShorthandOptions,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export type FastifyZodInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	FastifyBaseLogger,
	ZodTypeProvider
>;

// types/typed-request.ts
import type {
	FastifyRequest,
	FastifySchema,
	RouteGenericInterface,
} from "fastify";

export type ZodTypedRequest<Schema extends FastifySchema> = FastifyRequest<
	RouteGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression,
	Schema,
	ZodTypeProvider
>;

export type RouteSchema = RouteShorthandOptions["schema"];
