import { z } from "zod";

export const UserBaseSchema = z.object({
	id: z.uuid(),
	name: z.string().nullable(),
	email: z.email(),
	avatarUrl: z.url().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const UserProfileSchema = UserBaseSchema.pick({
	id: true,
	email: true,
	name: true,
	avatarUrl: true,
});
