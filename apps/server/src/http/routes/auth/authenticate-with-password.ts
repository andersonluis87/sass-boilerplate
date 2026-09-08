import prisma from "@sass-boiler-plate/db";
import argon2 from "argon2";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { BadRequestError } from "@/shared/_errors/bad-request-error.js";

async function authenticateWithPassword(app: FastifyInstance) {
	app.post(
		"/sessions/password",
		{
			schema: {
				tags: ["auth"],
				summary: "Authenticate with e-mail & password",
				body: z.object({
					email: z.email(),
					password: z.string(),
				}),
				response: {
					201: z.object({
						token: z.string(),
					}),
				},
			},
		},
		async (
			request: FastifyRequest<{ Body: { email: string; password: string } }>,
			reply: FastifyReply,
		) => {
			const { email, password } = request.body;

			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				throw new BadRequestError("Invalid credentials");
			}

			if (!user.passwordHash) {
				throw new BadRequestError(
					"User does not have a password, use a different authentication method",
				);
			}

			const passwordMatch = await argon2.verify(user.passwordHash, password);

			if (!passwordMatch) {
				throw new BadRequestError("Invalid credentials");
			}

			const token = await reply.jwtSign(
				{
					sub: user.id,
					email: user.email,
					name: user.name,
				},
				{
					expiresIn: "7d",
				},
			);

			return reply.status(201).send({
				token,
			});
		},
	);
}

export default authenticateWithPassword;
