import { createCaslExtension } from "@casl/prisma/runtime";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@sass-boiler-plate/env/server";

import { PrismaClient } from "../prisma/generated/client";

export type {
	Account,
	AccountProvider,
	Invite,
	Member,
	Organization,
	Prisma,
	Project,
	Role,
	Token,
	TokenType,
	User,
} from "../prisma/generated/client";

export function createPrismaClient() {
	const adapter = new PrismaPg({
		connectionString: env.DATABASE_URL,
	});

	const prismaClient = new PrismaClient({
		adapter,
		log: [
			{ level: "query", emit: "event" },
			{ level: "error", emit: "stdout" },
			{ level: "warn", emit: "stdout" },
		],
	});

	prismaClient.$on("query", (event) => {
		if (env.NODE_ENV !== "development" && event.duration < 200) {
			return;
		}

		console.log({
			msg: "prisma.query",
			query: event.query,
			params: env.NODE_ENV === "development" ? event.params : undefined,
			durationMs: event.duration,
		});
	});

	return prismaClient.$extends(createCaslExtension());
}

const prisma = createPrismaClient();
export default prisma;
