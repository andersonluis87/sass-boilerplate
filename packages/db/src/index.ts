import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@sass-boiler-plate/env/server";

import { PrismaClient } from "../prisma/generated/client";

export type {
	Member,
	Organization,
	Projects,
	Role,
	User,
} from "../prisma/generated/client";
export type {
	MemberUncheckedUpdateInput,
	MemberWhereInput,
	MemberWhereUniqueInput,
} from "../prisma/generated/models/Member";
export type {
	OrganizationUncheckedUpdateInput,
	OrganizationWhereInput,
	OrganizationWhereUniqueInput,
} from "../prisma/generated/models/Organization";

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

	return prismaClient;
}

const prisma = createPrismaClient();
export default prisma;
