import type { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";
import type {
	GithubCode,
	RequestPasswordRecover,
	ResetPassword,
	SignIn,
	SignUp,
} from "@/shared/schema/authentication.schema";
import { getEmailDomain } from "@/utils/get-email-domain.util";
import type { OrganizationRepository } from "../organization/organization.repository";
import type { AccountRepository } from "./account.repository";
import { signAuthToken } from "./services/auth-token.service";
import {
	exchangeCodeForAccessToken,
	getGithubUser,
} from "./services/github-oauth.service";
import { hashPassword, verifyPassword } from "./services/password.service";
import type { TokenRepository } from "./token.repository";
import type { UserRepository } from "./user.repository";

export class AuthenticationController {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly accountRepository: AccountRepository,
		private readonly tokenRepository: TokenRepository,
		private readonly organizationRepository: OrganizationRepository,
	) {}

	async signUp(request: FastifyRequest<{ Body: SignUp }>, reply: FastifyReply) {
		const { email, name, password } = request.body;

		await this.ensureEmailAvailable(email);

		const organization = await this.findOrganizationToAttach(email);
		const passwordHash = await hashPassword(password);

		await this.userRepository.create({
			email,
			name,
			passwordHash,
			organizationId: organization?.id,
		});

		reply.status(201).send(null);
	}

	async signIn(request: FastifyRequest<{ Body: SignIn }>, reply: FastifyReply) {
		const { email, password } = request.body;
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new BadRequestError("Invalid credentials");
		}

		if (!user.passwordHash) {
			throw new BadRequestError(
				"User does not have a password, use a different authentication method",
			);
		}

		const passwordMatch = await verifyPassword(user.passwordHash, password);

		if (!passwordMatch) {
			throw new BadRequestError("Invalid credentials");
		}

		const token = await signAuthToken(reply, user.id);

		reply.status(201).send({ token });
	}

	async signInWithGithub(
		request: FastifyRequest<{ Body: GithubCode }>,
		reply: FastifyReply,
	) {
		const { code } = request.body;
		const accessToken = await exchangeCodeForAccessToken(code);
		const githubUser = await getGithubUser(accessToken);

		let user = await this.userRepository.findByEmail(githubUser.email);

		if (!user) {
			user = await this.userRepository.create({
				email: githubUser.email,
				name: githubUser.name,
				avatarUrl: githubUser.avatar_url,
			});
		}

		await this.linkGithubAccount(user.id, githubUser.id);

		const token = await signAuthToken(reply, user.id);

		reply.status(201).send({ token });
	}

	async profile(request: FastifyRequest, reply: FastifyReply) {
		const user = await this.userRepository.findProfileById(
			request.currentUserId,
		);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		reply.status(200).send({ user });
	}

	async requestPasswordRecover(
		request: FastifyRequest<{ Body: RequestPasswordRecover }>,
		reply: FastifyReply,
	) {
		const { email } = request.body;
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			return reply.status(201).send(null);
		}

		const code = await this.tokenRepository.create("PASSWORD_RECOVER", user.id);

		// TODO: Send email with code
		console.log("Recover password token: ", code);

		reply.status(201).send(null);
	}

	async resetPassword(
		request: FastifyRequest<{ Body: ResetPassword }>,
		reply: FastifyReply,
	) {
		const { code, password } = request.body;
		const token = await this.tokenRepository.get(code);

		if (!token) {
			throw new UnauthorizedError("Invalid token");
		}

		const passwordHash = await hashPassword(password);

		await this.userRepository.updatePassword(token.userId, passwordHash);
		await this.tokenRepository.delete(token.id);

		reply.status(204).send(null);
	}

	private async ensureEmailAvailable(email: string) {
		const exists = await this.userRepository.exists({ email });

		if (exists) {
			throw new BadRequestError("User already exists");
		}
	}

	private async findOrganizationToAttach(email: string) {
		const domain = getEmailDomain(email);

		return this.organizationRepository.findFirst({
			domain,
			shouldAttachUsersByDomain: true,
		});
	}

	private async linkGithubAccount(userId: string, githubId: string) {
		const existingAccount = await this.accountRepository.findByProvider(
			"GITHUB",
			userId,
		);

		if (existingAccount) {
			return existingAccount;
		}

		return this.accountRepository.create({
			provider: "GITHUB",
			providerAccountId: githubId,
			userId,
		});
	}
}
