import { z } from "zod";

export const ProjectSchema = z.object({
	__typename: z.literal("Project").default("Project"),
	id: z.uuid(),
	ownerId: z.uuid(),
});

export type Project = z.infer<typeof ProjectSchema>;
