import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import prisma from "@sass-boiler-plate/db";

async function requestPasswordRecover(app: FastifyInstance) {
	app.post(
		"/password/recover",
		{
			schema: {
				tags: ["auth"],
				summary: "Request password token to reset password",
				body: z.object({
					email: z.email(),
				}),
				response: {
					201: z.null(),
				},
			},
		},
		async (
			request: FastifyRequest<{ Body: { email: string } }>,
			reply: FastifyReply,
		) => {
			const { email } = request.body;

			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				return reply.status(201).send(null);
			}

			const { id: code } = await prisma.token.create({
				data: {
					type: "PASSWORD_RECOVER",
					userId: user.id,
				},
			});

			// TODO: Send email with code
			console.log("Recover password token: ", code);

			return reply.status(201).send(null);
		},
	);
}

export default requestPasswordRecover;
