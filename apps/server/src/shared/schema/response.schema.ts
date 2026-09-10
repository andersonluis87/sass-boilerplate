import { z } from "zod";

export const NullResponseSchema = z.null();

export const MessageResponseSchema = z.object({
	message: z.string(),
});
