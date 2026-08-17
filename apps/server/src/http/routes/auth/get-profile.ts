import type { FastifyInstance } from "fastify";
import z from "zod";

import prisma from "@sass-boiler-plate/db";

import { BadRequestError } from "../_errors/bad-request-error.js";
import { protectedRoute } from "../fastify-zod-route-provider.js";

export async function getProfile(app: FastifyInstance) {
	protectedRoute(app).get(
		"/profile",
		{
			schema: {
				tags: ["auth"],
				summary: "Get authenticated user profile",
				security: [
					{
						bearerAuth: [],
					},
				],
				response: {
					200: z.object({
						user: z.object({
							id: z.uuid(),
							email: z.email(),
							name: z.string().nullable(),
							avatarUrl: z.url().nullable(),
						}),
					}),
					404: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const userId = await request.getCurrentUserId();

			const user = await prisma.user.findUnique({
				select: {
					id: true,
					email: true,
					name: true,
					avatarUrl: true,
				},
				where: {
					id: userId,
				},
			});

			if (!user) {
				throw new BadRequestError("User not found");
			}

			return reply.send({ user });
		},
	);
}
