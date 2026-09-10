import prisma, { type TokenType } from "@sass-boiler-plate/db";

export class TokenRepository {
	async create(type: TokenType, userId: string) {
		const { id } = await prisma.token.create({
			data: {
				type,
				userId,
			},
		});

		return id;
	}

	async get(id: string) {
		return prisma.token.findUnique({
			where: {
				id,
			},
		});
	}

	async delete(id: string) {
		return prisma.token.delete({
			where: {
				id,
			},
		});
	}
}
