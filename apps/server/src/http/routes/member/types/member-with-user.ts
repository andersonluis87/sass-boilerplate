import type { Prisma } from "@sass-boiler-plate/db";

export const userSelect = {
	id: true,
	name: true,
	email: true,
	avatarUrl: true,
} satisfies Prisma.UserSelect;

export type MemberWithUser = Prisma.MemberGetPayload<{
	include: {
		user: {
			select: typeof userSelect;
		};
	};
}>;
