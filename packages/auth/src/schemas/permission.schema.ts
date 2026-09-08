import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../define-ability-for";
import type { UserSchema } from "../models/user.model";
import type { Role } from "./role.schema";

type PermissionsByRole = (
	user: UserSchema,
	builder: AbilityBuilder<AppAbility>,
) => void;

export const PermissionsSchema: Record<Role, PermissionsByRole> = {
	ADMIN(_, { can }) {
		can("manage", "all");
	},
	MEMBER(user, { can }) {
		can(["get", "create"], "Project");

		// FIXME: This is not properly typed { params should respect the schema }
		can(["update", "delete"], "Project", { ownerId: user.id });
	},
	BILLING(_, { can }) {
		can("manage", "Billing");
	},
};
