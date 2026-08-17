import type { AbilityBuilder } from "@casl/ability";

import type { AppAbility } from "..";
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
		can(["manage", "get"], "Project");
		can(["update", "delete"], "Project", { ownerId: { $eq: user.id } });
	},
	BILLING(_, { can }) {
		can("manage", "Billing");
	},
};
