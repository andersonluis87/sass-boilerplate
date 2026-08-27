import { OrganizationSchema } from "@sass-boiler-plate/auth";
import prisma from "@sass-boiler-plate/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";
import { getUserPermissions } from "@/shared/get-user-permissions";
import type {
	CreateOrganization,
	TransferOrganization,
	UpdateOrganization,
} from "@/shared/schema/organization.schema";
import type { SlugSchema } from "@/shared/schema/slug.schema";
import type { OrganizationRepository } from "./organization.repository";

export class OrganizationController {
	private readonly repository: OrganizationRepository;

	constructor(private readonly app: FastifyInstance) {
		this.repository = app.organizationRepository;
	}

	// TODO: Paginate this route
	async list(request: FastifyRequest) {
		const organizations = await this.repository.list(request.currentUserId);
		return { organizations };
	}

	// TODO: remove dependency on request.getUserMembership
	async get(request: FastifyRequest<{ Params: SlugSchema }>) {
		const { slug } = request.params;
		const { organization } = await request.getUserMembership(slug);
		return { organization };
	}

	async getMembership(request: FastifyRequest<{ Params: SlugSchema }>) {
		const { slug } = request.params;
		const {
			membership: { id, role, organizationId },
		} = await request.getUserMembership(slug);
		return {
			membership: {
				id,
				role,
				organizationId,
			},
		};
	}

	async create(
		request: FastifyRequest<{
			Body: CreateOrganization;
		}>,
		reply: FastifyReply,
	) {
		const userId = request.currentUserId;
		const { domain, name, shouldAttachUsersByDomain } = request.body;
		const slug = this.app.createSlug(name);

		if (domain) {
			const organizationAlreadyExists = await this.repository.exists({
				domain,
				slug,
			});

			if (organizationAlreadyExists) {
				throw new BadRequestError(
					"Organization with this domain or name already exists",
				);
			}
		}

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
		const { slug } = request.params;
		const userId = request.currentUserId;

		const {
			membership: { role },
			organization,
		} = await request.getUserMembership(slug);
		const authOrganization = OrganizationSchema.parse(organization);
		const { cannot } = getUserPermissions(userId, role);
		if (cannot("delete", authOrganization)) {
			throw new UnauthorizedError(
				"You are not allowed to shutdown this organization",
			);
		}

		await prisma.organization.delete({
			where: {
				id: organization.id,
			},
		});

		return reply.status(204).send(null);
	}

	async transfer(
		request: FastifyRequest<{
			Params: SlugSchema;
			Body: TransferOrganization;
		}>,
		reply: FastifyReply,
	) {
		const { slug } = request.params;
		const { transferToUserId } = request.body;

		const userId = request.currentUserId;
		const {
			membership: { role },
			organization,
		} = await request.getUserMembership(slug);

		const authOrganization = OrganizationSchema.parse(organization);

		const { cannot } = getUserPermissions(userId, role);

		if (cannot("transfer_ownership", authOrganization)) {
			throw new UnauthorizedError(
				"You are not allowed to transfer this organization ownership",
			);
		}

		const newOrganizationOwner = await prisma.member.findUnique({
			where: {
				organizationId_userId: {
					organizationId: organization.id,
					userId: transferToUserId,
				},
			},
		});

		if (!newOrganizationOwner) {
			throw new BadRequestError(
				"Target user is not a member of this organization",
			);
		}

		await prisma.$transaction([
			prisma.member.update({
				where: {
					organizationId_userId: {
						organizationId: organization.id,
						userId,
					},
				},
				data: {
					role: "MEMBER",
				},
			}),
			prisma.organization.update({
				where: {
					id: organization.id,
				},
				data: {
					ownerId: transferToUserId,
				},
			}),
		]);

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
		const userId = request.currentUserId;

		const {
			membership: { role },
			organization,
		} = await request.getUserMembership(slug);

		const authOrganization = OrganizationSchema.parse(organization);

		const { cannot } = getUserPermissions(userId, role);

		if (cannot("update", authOrganization)) {
			throw new UnauthorizedError(
				"You are not allowed to update this organization",
			);
		}

		if (domain) {
			const organizationExistsByDomain = await prisma.organization.findFirst({
				where: {
					domain,
					slug: {
						not: slug,
					},
				},
			});

			if (organizationExistsByDomain) {
				throw new BadRequestError(
					"Organization with this domain already exists",
				);
			}
		}

		await this.repository.update({
			id: organization.id,
			name,
			domain,
			shouldAttachUsersByDomain,
		});

		return reply.status(204).send(null);
	}
}
