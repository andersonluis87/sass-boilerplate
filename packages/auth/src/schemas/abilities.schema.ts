import { z } from "zod";
import { BillingSubject } from "../subjects/billing.subject";
import { InviteSubject } from "../subjects/invite.subject";
import { MemberSubject } from "../subjects/member.subject";
import { OrganizationSubject } from "../subjects/organizations.subject";
import { ProjectSubject } from "../subjects/project.subject";
import { UserSubject } from "../subjects/user.subject";

const AppAbilitiesSchema = z.union([
	UserSubject,
	ProjectSubject,
	OrganizationSubject,
	InviteSubject,
	MemberSubject,
	BillingSubject,
	z.tuple([z.literal("manage"), z.literal("all")]),
]);

export type AppAbilities = z.infer<typeof AppAbilitiesSchema>;
