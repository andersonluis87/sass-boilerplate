import type { RouteShorthandOptions } from "fastify";

export const Tags = {
	Organizations: "Organizations",
	Members: "Members",
	Projects: "Projects",
	Authentication: "Authentication",
} as const;

type Tag = (typeof Tags)[keyof typeof Tags];

export const Security = {
	bearerAuth: { "Bearer Auth": [] },
} as const satisfies Record<string, Record<string, readonly string[]>>;
type SecuritySchema = (typeof Security)[keyof typeof Security];

export type RouteSchema = RouteShorthandOptions["schema"] & {
	tags?: Tag[];
	security?: SecuritySchema[];
};
