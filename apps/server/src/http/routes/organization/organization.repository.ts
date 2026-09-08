import prisma, { type Prisma } from "@sass-boiler-plate/db";
import type { CreateOrganization } from "@/shared/schema/organization.schema";

export class OrganizationRepository {
	async list(userId: string) {
		return prisma.organization.findMany({
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

	async update(
		where: Prisma.OrganizationWhereInput,
		data: Prisma.OrganizationUncheckedUpdateInput,
	) {
		return prisma.organization.updateMany({
			where,
			data,
		});
	}

	async delete(where: Prisma.OrganizationWhereInput) {
		return prisma.organization.deleteMany({
			where,
		});
	}

	async findFirst(where: Prisma.OrganizationWhereInput) {
		return prisma.organization.findFirst({
			where,
		});
	}

	async exists(where: Prisma.OrganizationWhereInput) {
		const count = await prisma.organization.count({
			where,
		});

		return count > 0;
	}

	async transferOwnership(
		where: Prisma.OrganizationWhereInput,
		organizationId: string,
		userId: string,
	) {
		return prisma.$transaction(async (tx) => {
			const organization = await tx.organization.updateMany({
				where,
				data: {
					ownerId: userId,
				},
			});

			if (organization.count === 0) {
				return organization;
			}

			await tx.member.update({
				where: {
					organizationId_userId: {
						organizationId,
						userId,
					},
				},
				data: {
					role: "MEMBER",
				},
			});

			return organization;
		});
	}
}
