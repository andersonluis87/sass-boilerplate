import prisma, { type Prisma } from "@sass-boiler-plate/db";
import { userProfileSelect } from "./types/user-profile";

interface CreateUserData {
	name?: string;
	email: string;
	passwordHash?: string;
	avatarUrl?: string;
	organizationId?: string;
}

export class UserRepository {
	async findByEmail(email: string) {
		return prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	async findProfileById(id: string) {
		return prisma.user.findUnique({
			select: userProfileSelect,
			where: {
				id,
			},
		});
	}

	async create({ organizationId, ...data }: CreateUserData) {
		return prisma.user.create({
			data: {
				...data,
				member_on: organizationId
					? {
							create: {
								organizationId,
							},
						}
					: undefined,
			},
		});
	}

	async updatePassword(userId: string, passwordHash: string) {
		return prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				passwordHash,
			},
		});
	}

	async exists(where: Prisma.UserWhereInput) {
		const count = await prisma.user.count({
			where,
		});

		return count > 0;
	}
}
