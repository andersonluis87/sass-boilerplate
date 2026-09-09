import { z } from "zod";
import { SlugSchema } from "@/shared/schema/slug.schema";

export const ProjectBaseSchema = z.object({
	id: z.uuid(),
	name: z.string().nonempty(),
	description: z.string().nullable(),
	slug: z.string().nonempty(),
	avatarUrl: z.url().nullable(),
	organizationId: z.uuid(),
	ownerId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ProjectOwnerSchema = z.object({
	id: z.uuid(),
	name: z.string().nullable(),
	avatarUrl: z.url().nullable(),
});

export const ProjectWithOwnerSchema = ProjectBaseSchema.pick({
	id: true,
	name: true,
	description: true,
	slug: true,
	avatarUrl: true,
	createdAt: true,
}).extend({
	owner: ProjectOwnerSchema,
});

export const ManageProjectSchema = z.object({
	name: z.string().nonempty(),
	description: z.string(),
	avatarUrl: z.url().optional(),
});

export const UpdateProjectSchema = ManageProjectSchema.strict().partial();

export const ProjectSlugParamsSchema = SlugSchema.extend({
	projectSlug: z.string().min(1),
});

export const ProjectIdParamsSchema = SlugSchema.extend({
	id: z.uuid(),
});

export type ManageProject = z.infer<typeof ManageProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectSlugParams = z.infer<typeof ProjectSlugParamsSchema>;
export type ProjectIdParams = z.infer<typeof ProjectIdParamsSchema>;
export type CreateProject = ManageProject & {
	slug: string;
	organizationId: string;
	ownerId: string;
};
