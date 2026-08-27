import prisma from "@sass-boiler-plate/db";
import type {
	CreateOrganization,
	Organization,
	UpdateOrganization,
} from "@/shared/schema/organization.schema";
import type { OrganizationListItem } from "./organization.types";

export class OrganizationRepository {
	async list(userId: string) {
		const organizations = await prisma.organization.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
				avatarUrl: true,
				members: {
					select: {
						role: true,
					},
					where: {
						userId,
					},
				},
			},
			where: {
				members: {
					some: {
						userId,
					},
				},
			},
		});

		return this.toOrganizationsWithRole(organizations);
	}

	async create({ userId, ...data }: CreateOrganization) {
		const { id } = await prisma.organization.create({
			data: {
				...data,
				ownerId: userId,
				members: {
					create: {
						userId,
						role: "ADMIN",
					},
				},
			},
		});

		return id;
	}

	async update({ id, ...data }: UpdateOrganization) {
		await prisma.organization.update({
			where: {
				id,
			},
			data,
		});
	}

	async exists({ domain, slug }: Pick<Organization, "domain" | "slug">) {
		const count = await prisma.organization.count({
			where: {
				OR: [{ domain }, { slug }],
			},
		});

		return count > 0;
	}

	private toOrganizationsWithRole(organizations: OrganizationListItem[]) {
		return organizations.map(({ members, ...organization }) => {
			return {
				...organization,
				role: members[0]?.role ?? "MEMBER",
			};
		});
	}
}
