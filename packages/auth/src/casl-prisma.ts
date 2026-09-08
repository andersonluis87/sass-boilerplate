import type { Ability } from "@casl/ability";
import {
	accessibleBy,
	createPrismaAbility,
	type PrismaQueryOf,
	type Subjects,
	type WhereInputOf,
} from "@casl/prisma/runtime";
import type {
	Invite,
	Member,
	Organization,
	Prisma,
	Project,
} from "@sass-boiler-plate/db";

export { accessibleBy, createPrismaAbility };

export type PrismaQuery = PrismaQueryOf<Prisma.TypeMap>;

export type WhereInput<TModelName extends Prisma.ModelName> = WhereInputOf<
	Prisma.TypeMap,
	TModelName
>;

export type AppAction =
	| "manage"
	| "get"
	| "create"
	| "update"
	| "delete"
	| "transfer_ownership"
	| "export";

export type PrismaSubjects = Subjects<{
	Organization: Organization;
	Project: Project;
	Member: Member;
	Invite: Invite;
}>;

export type AppSubject = PrismaSubjects | "all" | "Billing" | "User";

export type AppAbility = Ability<[AppAction, AppSubject], PrismaQuery>;

export type AccessibleModel = Extract<
	PrismaSubjects,
	"Organization" | "Project" | "Member" | "Invite"
>;
