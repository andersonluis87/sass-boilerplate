import { subject } from "@casl/ability";
import type { Project } from "../models/project.model";

export function toProjectSubject(project: Pick<Project, "id" | "ownerId">) {
	return subject("Project", project);
}
