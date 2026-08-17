import type { FastifyInstance } from "fastify";
import z from "zod";
import argon2 from "argon2";

import prisma from "@sass-boiler-plate/db";

import { UnauthorizedError } from "../_errors/unauthorized-error.js";
import { route } from "../fastify-zod-route-provider.js";

export async function resetPassword(app: FastifyInstance) {
	route(app).post(
		"/password/reset",
		{
			schema: {
				tags: ["auth"],
				summary: "Reset password with token",
				body: z.object({
					code: z.uuid(),
					password: z.string().min(8),
				}),
				response: {
					204: z.null(),
				},
			},
		},
		async (request, reply) => {
			const { code, password } = request.body;

			const tokenFromCode = await prisma.token.findUnique({
				where: {
					id: code,
				},
			});

			if (!tokenFromCode) {
				throw new UnauthorizedError("Invalid token");
			}

			const passwordHash = await argon2.hash(password);

			await prisma.user.update({
				where: {
					id: tokenFromCode.userId,
				},
				data: {
					passwordHash,
				},
			});

			// TODO: Invalidate token after updating password

			return reply.status(204).send(null);
		},
	);
}
