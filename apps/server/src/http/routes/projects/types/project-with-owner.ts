import type { Prisma } from "@sass-boiler-plate/db";

export const projectWithOwnerSelect = {
	id: true,
	name: true,
	description: true,
	slug: true,
	avatarUrl: true,
	createdAt: true,
	owner: {
		select: {
			id: true,
			name: true,
			avatarUrl: true,
		},
	},
} satisfies Prisma.ProjectSelect;

export type ProjectWithOwner = Prisma.ProjectGetPayload<{
	select: typeof projectWithOwnerSelect;
}>;
