import type { Prisma } from "@sass-boiler-plate/db";

export const userProfileSelect = {
	id: true,
	email: true,
	name: true,
	avatarUrl: true,
} satisfies Prisma.UserSelect;

export type UserProfile = Prisma.UserGetPayload<{
	select: typeof userProfileSelect;
}>;
