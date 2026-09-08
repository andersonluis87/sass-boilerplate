import { AbilityBuilder, type CreateAbility } from "@casl/ability";
import { createPrismaAbility, type PrismaAbility } from "@casl/prisma";
import type { UserSchema } from "./models/user.model";
import type { AppAbilities } from "./schemas/abilities.schema";
import { PermissionsSchema } from "./schemas/permission.schema";

export type AppAbility = PrismaAbility<AppAbilities>;

const createAppAbility = createPrismaAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: UserSchema) {
	const builder = new AbilityBuilder(createAppAbility);

	if (typeof PermissionsSchema[user.role] !== "function") {
		throw new Error(`Invalid role: ${user.role}`);
	}

	PermissionsSchema[user.role](user, builder);

	return builder.build({
		detectSubjectType(subject) {
			return subject.__typename;
		},
	});
}
