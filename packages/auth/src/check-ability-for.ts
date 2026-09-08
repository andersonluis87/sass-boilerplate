import { defineAbilityFor } from "./define-ability-for";
import { UserSchema } from "./models/user.model";
import type { Role } from "./schemas/role.schema";

export function createAbilityFor(id: string, role: Role) {
	const authUser = UserSchema.parse({
		id,
		role,
	});

	return defineAbilityFor(authUser);
}
