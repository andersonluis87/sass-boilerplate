import prisma, {
	type OrganizationUncheckedUpdateInput,
	type OrganizationWhereInput,
} from "@sass-boiler-plate/db";
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

	async update(id: string, data: OrganizationUncheckedUpdateInput) {
		return prisma.organization.update({
			where: {
				id,
			},
			data,
		});
	}

	async delete(id: string, userId: string) {
		const deleted = await prisma.organization.delete({
			where: {
				id,
				members: {
					some: {
						userId,
					},
				},
			},
		});

		return deleted;
	}

	async findFirst(where: OrganizationWhereInput) {
		return prisma.organization.findFirst({
			where,
		});
	}

	async exists(where: OrganizationWhereInput) {
		const count = await prisma.organization.count({
			where,
		});

		return count > 0;
	}

	async transferOwnership(id: string, userId: string) {
		await prisma.$transaction(async (tx) => [
			await tx.member.update({
				where: {
					organizationId_userId: {
						organizationId: id,
						userId,
					},
				},
				data: {
					role: "MEMBER",
				},
			}),

			await tx.organization.update({
				where: {
					id,
				},
				data: {
					ownerId: userId,
				},
			}),
		]);
	}
}
