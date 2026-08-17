import {
	AbilityBuilder,
	type CreateAbility,
	createMongoAbility,
	type MongoAbility,
} from "@casl/ability";
import { z } from "zod";

import type { UserSchema } from "./models/user.model";
import { PermissionsSchema } from "./schemas/permission.schema";
import { BillingSubject } from "./subjects/billing.subject";
import { InviteSubject } from "./subjects/invite.subject";
import { OrganizationSubject } from "./subjects/organizations.subject";
import { ProjectSubject } from "./subjects/project.subject";
import { UserSubject } from "./subjects/user.subject";

export { OrganizationSchema } from "./models/organization.model";
export { ProjectSchema } from "./models/project.model";
export { UserSchema } from "./models/user.model";
export { Role } from "./schemas/role.schema";

const appAbilitiesSchema = z.union([
	UserSubject,
	ProjectSubject,
	OrganizationSubject,
	InviteSubject,
	BillingSubject,

	z.tuple([z.literal("manage"), z.literal("all")]),
]);
type AppAbilities = z.infer<typeof appAbilitiesSchema>;
export type AppAbility = MongoAbility<AppAbilities>;

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: UserSchema) {
	const builder = new AbilityBuilder(createAppAbility);

	if (typeof PermissionsSchema[user.role] !== "function") {
		throw new Error(`Invalid role: ${user.role}`);
	}

	PermissionsSchema[user.role](user, builder);

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename;
		},
	});

	ability.can = ability.can.bind(ability);
	ability.cannot = ability.cannot.bind(ability);

	return ability;
}
