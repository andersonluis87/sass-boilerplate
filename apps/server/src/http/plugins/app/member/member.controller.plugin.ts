import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { MemberController } from "@/http/routes/member/member.controller";

declare module "fastify" {
	interface FastifyInstance {
		memberController: MemberController;
	}
}

export default fp(
	async (app: FastifyInstance) => {
		app.decorate(
			"memberController",
			new MemberController(app.memberRepository),
		);
	},
	{
		name: "member-controller",
		dependencies: ["member-repository"],
	},
);
