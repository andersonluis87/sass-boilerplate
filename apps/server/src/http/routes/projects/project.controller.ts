import type { FastifyReply, FastifyRequest } from "fastify";
import { BadRequestError } from "@/shared/_errors/bad-request-error";
import { NotFoundError } from "@/shared/_errors/not-found-error";
import type {
	ManageProject,
	ProjectIdParams,
	ProjectSlugParams,
	UpdateProject,
} from "@/shared/schema/project.schema";
import type { SlugSchema } from "@/shared/schema/slug.schema";
import {
	assertWriteAllowed,
	constrainWhere,
} from "@/utils/accessible-where.util";
import { createSlug } from "@/utils/create-slug.util";
import type { ProjectRepository } from "./project.repository";

export class ProjectController {
	constructor(private readonly repository: ProjectRepository) {}

	async list(
		request: FastifyRequest<{ Params: SlugSchema }>,
		reply: FastifyReply,
	) {
		const where = constrainWhere(request, "get", "Project");
		const projects = await this.repository.list(where);

		reply.status(200).send({ projects });
	}

	async get(
		request: FastifyRequest<{ Params: ProjectSlugParams }>,
		reply: FastifyReply,
	) {
		const { projectSlug } = request.params;
		const where = constrainWhere(request, "get", "Project", {
			slug: projectSlug,
		});
		const project = await this.repository.findFirst(where);

		if (!project) {
			throw new NotFoundError("Project not found");
		}

		reply.status(200).send({ project });
	}

	async create(
		request: FastifyRequest<{
			Params: SlugSchema;
			Body: ManageProject;
		}>,
		reply: FastifyReply,
	) {
		const { currentUserId: ownerId, organization } = request;
		const { name, description, avatarUrl } = request.body;
		const slug = createSlug(name);

		await this.ensureProjectUnique(slug);

		const projectId = await this.repository.create({
			name,
			slug,
			description,
			avatarUrl,
			organizationId: organization.id,
			ownerId,
		});

		reply.status(201).send({ projectId });
	}

	async update(
		request: FastifyRequest<{
			Params: ProjectIdParams;
			Body: UpdateProject;
		}>,
		reply: FastifyReply,
	) {
		const { id } = request.params;
		const { name, description, avatarUrl } = request.body;
		const where = constrainWhere(request, "update", "Project", { id });
		const updated = await this.repository.update(where, {
			name,
			description,
			avatarUrl,
		});

		assertWriteAllowed(updated.count);

		reply.status(204).send(null);
	}

	async delete(
		request: FastifyRequest<{ Params: ProjectIdParams }>,
		reply: FastifyReply,
	) {
		const { id } = request.params;
		const where = constrainWhere(request, "delete", "Project", { id });
		const deleted = await this.repository.delete(where);

		assertWriteAllowed(deleted.count);

		reply.status(204).send(null);
	}

	private async ensureProjectUnique(slug: string) {
		const exists = await this.repository.exists({ slug });

		if (exists) {
			throw new BadRequestError("Project with this name already exists");
		}
	}
}
