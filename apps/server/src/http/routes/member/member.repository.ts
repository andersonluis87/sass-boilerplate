import prisma, { type Role } from "@sass-boiler-plate/db";

interface GetMembershipData {
	userId: string;
	slug: string;
}

interface UpdateMemberData {
	id: string;
	role: Role;
	organizationId: string;
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

	async update({ id, role, organizationId }: UpdateMemberData) {
		return prisma.member.update({
			where: {
				id,
				organizationId,
			},
			data: {
				role,
			},
		});
	}
}
