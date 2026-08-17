import { z } from "zod";

export const OrganizationSchema = z.object({
	__typename: z.literal("Organization").default("Organization"),
	id: z.uuid(),
	ownerId: z.uuid(),
});

export type Organization = z.infer<typeof OrganizationSchema>;
