import type { Prisma } from "@sass-boiler-plate/db";
import type { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import type {
	CreateOrganization,
	TransferOrganization,
	UpdateOrganization,
} from "@/shared/schema/organization.schema";
import type { SlugSchema } from "@/shared/schema/slug.schema";
import {
	assertWriteAllowed,
	constrainWhere,
} from "@/utils/accessible-where.util";
import { createSlug } from "@/utils/create-slug.util";
import type { MemberRepository } from "../member/member.repository";
import { organizationWithRole } from "./mappers/organization-with-role.mapper";
import type { OrganizationRepository } from "./organization.repository";

export class OrganizationController {
	constructor(
		private readonly repository: OrganizationRepository,
		private readonly memberRepository: MemberRepository,
	) {}

	async list(request: FastifyRequest) {
		const organizations = await this.repository.list(request.currentUserId);
		return { organizations: organizationWithRole(organizations) };
	}

	async get(request: FastifyRequest) {
		return { organization: request.organization };
	}

	async getMembership({ membership }: FastifyRequest) {
		return {
			membership: {
				id: membership.id,
				role: membership.role,
				organizationId: membership.organizationId,
			},
		};
	}

	async create(
		request: FastifyRequest<{
			Body: CreateOrganization;
		}>,
		reply: FastifyReply,
	) {
		const { currentUserId: userId } = request;
		const { domain, name, shouldAttachUsersByDomain } = request.body;
		const slug = createSlug(name);

		await this.ensureOrganizationUnique(slug, domain);

		const id = await this.repository.create({
			userId,
			slug,
			name,
			domain,
			shouldAttachUsersByDomain,
		});

		reply.status(201).send({ id });
	}

	async shutdown(
		request: FastifyRequest<{ Params: SlugSchema }>,
		reply: FastifyReply,
	) {
		const where = constrainWhere(request, "delete", "Organization");
		const deleted = await this.repository.delete(where);
		assertWriteAllowed(deleted.count);

		return reply.status(204).send(null);
	}

	async transfer(
		request: FastifyRequest<{
			Params: SlugSchema;
			Body: TransferOrganization;
		}>,
		reply: FastifyReply,
	) {
		const { transferToUserId } = request.body;
		const { organization } = request;

		const newOrganizationOwner = await this.memberRepository.findUnique({
			organizationId_userId: {
				organizationId: organization.id,
				userId: transferToUserId,
			},
		});

		if (!newOrganizationOwner) {
			throw new BadRequestError(
				"Target user is not a member of this organization",
			);
		}

		const where = constrainWhere(request, "transfer_ownership", "Organization");
		const transferred = await this.repository.transferOwnership(
			where,
			organization.id,
			transferToUserId,
		);
		assertWriteAllowed(transferred.count);

		return reply.status(204).send(null);
	}

	async update(
		request: FastifyRequest<{
			Params: SlugSchema;
			Body: UpdateOrganization;
		}>,
		reply: FastifyReply,
	) {
		const { slug } = request.params;
		const { name, domain, shouldAttachUsersByDomain } = request.body;

		await this.ensureOrganizationUnique(slug, domain);

		const where = constrainWhere(request, "update", "Organization");
		const updated = await this.repository.update(where, {
			name,
			domain,
			shouldAttachUsersByDomain,
		});
		assertWriteAllowed(updated.count);

		return reply.status(204).send(null);
	}

	private async ensureOrganizationUnique(slug: string, domain?: string) {
		const filters: Prisma.OrganizationWhereInput[] = [{ slug }];

		if (domain) {
			filters.push({ domain });
		}

		const exists = await this.repository.exists({
			OR: filters,
		});

		if (exists) {
			throw new BadRequestError(
				"Organization with this domain or name already exists",
			);
		}
	}
}
