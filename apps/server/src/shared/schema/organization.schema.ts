import { z } from "zod";

export const OrganizationBaseSchema = z.object({
	id: z.uuid(),
	name: z.string().nonempty(),
	slug: z.string().nonempty(),
	domain: z.string().nonempty().optional(),
	shouldAttachUsersByDomain: z.boolean().default(false),
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
export type CreateOrganization = z.infer<typeof ManageOrganizationSchema> & {
	userId: string;
	slug: string;
};
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;
export type TransferOrganization = z.infer<typeof TransferOrganizationSchema>;
