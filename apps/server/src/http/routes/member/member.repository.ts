import prisma, { type Prisma } from "@sass-boiler-plate/db";
import { userSelect } from "./types/member-with-user";

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

	async findUnique(where: Prisma.MemberWhereUniqueInput) {
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

	async listOrganizationMembers(where: Prisma.MemberWhereInput) {
		return prisma.member.findMany({
			include: {
				user: {
					select: userSelect,
				},
			},
			where,
			orderBy: {
				role: "asc",
			},
		});
	}

	async update(
		where: Prisma.MemberWhereInput,
		data: Prisma.MemberUncheckedUpdateInput,
	) {
		return prisma.member.updateMany({
			where,
			data,
		});
	}
}
