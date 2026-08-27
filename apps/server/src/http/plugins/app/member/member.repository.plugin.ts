import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { MemberRepository } from "@/http/routes/member/member.repository";

declare module "fastify" {
	interface FastifyInstance {
		memberRepository: MemberRepository;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate("memberRepository", new MemberRepository());
	},
	{
		name: "member-repository",
	},
);
