import { z } from "zod";

export const SlugSchema = z.object({
	slug: z.string().min(1),
});

export type SlugSchema = z.infer<typeof SlugSchema>;
