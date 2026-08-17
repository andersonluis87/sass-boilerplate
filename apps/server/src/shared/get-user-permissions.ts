import type { Role } from "@sass-boiler-plate/auth";
import { defineAbilityFor, UserSchema } from "@sass-boiler-plate/auth";

export function getUserPermissions(id: string, role: Role) {
	const authUser = UserSchema.parse({
		id,
		role,
	});

	const ability = defineAbilityFor(authUser);

	return ability;
}
