import type { FastifyReply } from "fastify";

const AUTH_TOKEN_EXPIRES_IN = "7d";

export const signAuthToken = (reply: FastifyReply, userId: string) => {
	return reply.jwtSign({ sub: userId }, { expiresIn: AUTH_TOKEN_EXPIRES_IN });
};
