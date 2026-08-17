import { z } from "zod";

import { ProjectSchema } from "../models/project.model";

export const ProjectSubject = z.tuple([
	z.union([
		z.literal("manage"),
		z.literal("get"),
		z.literal("update"),
		z.literal("create"),
		z.literal("delete"),
	]),

	z.union([z.literal("Project"), ProjectSchema]),
]);
export type ProjectSubject = z.infer<typeof ProjectSubject>;
