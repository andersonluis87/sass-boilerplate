import prisma, { type AccountProvider } from "@sass-boiler-plate/db";

interface CreateAccountData {
	provider: AccountProvider;
	providerAccountId: string;
	userId: string;
}

export class AccountRepository {
	async findByProvider(provider: AccountProvider, userId: string) {
		return prisma.account.findUnique({
			where: {
				provider_userId: {
					provider,
					userId,
				},
			},
		});
	}

	async create(data: CreateAccountData) {
		return prisma.account.create({
			data,
		});
	}
}
