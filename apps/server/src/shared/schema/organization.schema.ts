import { z } from "zod";
import { SlugSchema } from "./slug.schema";

export const OrganizationBaseSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	slug: z.string(),
	domain: z.string().nullable(),
	shouldAttachUsersByDomain: z.boolean(),
	avatarUrl: z.url().nullable(),
	ownerId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ManageOrganizationSchema = OrganizationBaseSchema.pick({
	name: true,
	domain: true,
	shouldAttachUsersByDomain: true,
});

export const CreateOrganizationSchema = SlugSchema.and(
	ManageOrganizationSchema,
).and(
	z.object({
		userId: z.uuid(),
	}),
);

export const UpdateOrganizationSchema = ManageOrganizationSchema.and(
	z.object({
		id: z.uuid(),
	}),
);

export const TransferOrganizationSchema = z.object({
	transferToUserId: z.uuid(),
});

export type Organization = z.infer<typeof OrganizationBaseSchema>;
export type ManageOrganization = z.infer<typeof ManageOrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
export type TransferOrganization = z.infer<typeof TransferOrganizationSchema>;
