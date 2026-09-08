import prisma, {
	type MemberUncheckedUpdateInput,
	type MemberWhereUniqueInput,
} from "@sass-boiler-plate/db";

interface GetMembershipData {
	userId: string;
	slug: string;
}

export class MemberRepository {
	async getMembership({ userId, slug }: GetMembershipData) {
		return prisma.member.findFirst({
			where: {
				userId,
				organization: {
					slug,
				},
			},
			include: {
				organization: true,
			},
		});
	}

	async findUnique(where: MemberWhereUniqueInput) {
		return prisma.member.findUnique({
			where,
		});
	}

	async isAdmin(userId: string) {
		const membership = await prisma.member.findFirst({
			where: {
				userId,
				role: "ADMIN",
			},
			select: {
				id: true,
			},
		});

		return Boolean(membership);
	}

	async listOrganizationMembers(organizationId: string) {
		return prisma.member.findMany({
			select: {
				id: true,
				role: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						avatarUrl: true,
					},
				},
			},
			where: {
				organizationId: organizationId,
			},
			orderBy: {
				role: "asc",
			},
		});
	}

	async update(id: string, data: MemberUncheckedUpdateInput) {
		return prisma.member.update({
			where: {
				id,
			},
			data,
		});
	}
}
