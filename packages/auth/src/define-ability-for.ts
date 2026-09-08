import { AbilityBuilder, type CreateAbility } from "@casl/ability";
import type { AppAbility } from "./casl-prisma";
import { createPrismaAbility } from "./casl-prisma";
import type { UserSchema } from "./models/user.model";
import { PermissionsSchema } from "./schemas/permission.schema";

export type { AppAbility } from "./casl-prisma";

const createAppAbility = createPrismaAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: UserSchema) {
	const builder = new AbilityBuilder(createAppAbility);

	if (typeof PermissionsSchema[user.role] !== "function") {
		throw new Error(`Invalid role: ${user.role}`);
	}

	PermissionsSchema[user.role](user, builder);

	return builder.build();
}
