import type { Prisma } from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { NotFoundError } from "@/shared/_errors/not-found-error";
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
import { organizationWithRoleMapper } from "./mappers/organization-with-role.mapper";
import type { OrganizationRepository } from "./organization.repository";

export class OrganizationController {
	private readonly repository: OrganizationRepository;

	constructor(private readonly app: FastifyInstance) {
		this.repository = app.organizationRepository;
	}

	async list(request: FastifyRequest) {
		const organizations = await this.repository.list(request.currentUserId);
		return { organizations: organizationWithRoleMapper(organizations) };
	}

	async get(request: FastifyRequest) {
		return { organization: request.organization };
	}

	async getMembership(request: FastifyRequest) {
		return {
			membership: {
				id: request.membership?.id,
				role: request.membership?.role,
				organizationId: request.membership?.organizationId,
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
		if (!organization) {
			throw new NotFoundError("Organization not found");
		}

		const newOrganizationOwner = await this.app.memberRepository.findUnique({
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

		const transferred = await this.repository.transferOwnership(
			constrainWhere(request, "transfer_ownership", "Organization"),
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
		const organization = request.organization;

		if (!organization) {
			throw new NotFoundError("Organization not found");
		}

		if (domain) {
			const organizationExistsByDomain = await this.repository.findFirst({
				domain,
				slug: {
					not: slug,
				},
			});

			if (organizationExistsByDomain) {
				throw new BadRequestError(
					"Organization with this domain already exists",
				);
			}
		}

		const updated = await this.repository.update(
			constrainWhere(request, "update", "Organization"),
			{
				name,
				domain,
				shouldAttachUsersByDomain,
			},
		);
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
