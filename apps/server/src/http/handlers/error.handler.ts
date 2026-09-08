import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import z, { ZodError } from "zod";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (
	error: unknown,
	_: FastifyRequest,
	reply: FastifyReply,
) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: "Validation error",
			errors: error.validation,
		});
	}

	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Validation error",
			errors: z.treeifyError(error),
		});
	}

	if (error instanceof NotFoundError) {
		return reply.status(404).send({
			message: error.message,
		});
	}

	if (error instanceof BadRequestError) {
		return reply.status(400).send({
			message: error.message,
		});
	}

	if (error instanceof UnauthorizedError) {
		return reply.status(401).send({
			message: error.message,
		});
	}

	// TODO: Send error to Sentry or other error tracking service
	console.error(error);

	return reply.status(500).send({ message: "Internal server error" });
};
