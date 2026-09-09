import prisma, { type Prisma } from "@sass-boiler-plate/db";
import type { CreateProject } from "@/shared/schema/project.schema";
import { projectWithOwnerSelect } from "./types/project-with-owner";

export class ProjectRepository {
	async list(where: Prisma.ProjectWhereInput) {
		return prisma.project.findMany({
			select: projectWithOwnerSelect,
			where,
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findFirst(where: Prisma.ProjectWhereInput) {
		return prisma.project.findFirst({
			select: projectWithOwnerSelect,
			where,
		});
	}

	async create(data: CreateProject) {
		const { id } = await prisma.project.create({
			data,
		});

		return id;
	}

	async update(
		where: Prisma.ProjectWhereInput,
		data: Prisma.ProjectUncheckedUpdateInput,
	) {
		return prisma.project.updateMany({
			where,
			data,
		});
	}

	async delete(where: Prisma.ProjectWhereInput) {
		return prisma.project.deleteMany({
			where,
		});
	}

	async exists(where: Prisma.ProjectWhereInput) {
		const count = await prisma.project.count({
			where,
		});

		return count > 0;
	}
}
