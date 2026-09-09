import type { Role } from "@sass-boiler-plate/auth";
import type { FastifyReply, FastifyRequest } from "fastify";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import type { SlugSchema } from "@/shared/schema/slug.schema";
import {
	assertWriteAllowed,
	constrainWhere,
} from "@/utils/accessible-where.util";
import { membersWithRoles } from "./mappers/members-with-roles.mapper";
import type { MemberRepository } from "./member.repository";
import type { UpdateMemberRouteSchema } from "./schemas/update-members.schema";

export class MemberController {
	constructor(private readonly repository: MemberRepository) {}

	async list(
		request: FastifyRequest<{ Params: SlugSchema }>,
		reply: FastifyReply,
	) {
		const where = constrainWhere(request, "get", "Member");
		const members = await this.repository.listOrganizationMembers(where);

		if (!members.length) {
			throw new NotFoundError("No members found");
		}

		return reply.status(200).send({ members: membersWithRoles(members) });
	}

	async update(
		request: FastifyRequest<{
			Params: UpdateMemberRouteSchema;
			Body: { role: Role };
		}>,
		reply: FastifyReply,
	) {
		const { memberId } = request.params;
		const { role } = request.body;

		const where = constrainWhere(request, "update", "Member", {
			id: memberId,
		});
		const updated = await this.repository.update(where, { role });

		assertWriteAllowed(updated.count);

		reply.status(204).send(null);
	}
}
