import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../casl-prisma";
import {
	inMemberOrganization,
	memberOfOrganization,
} from "../helpers/membership.condition";
import type { UserSchema } from "../models/user.model";
import type { Role } from "./role.schema";

type PermissionsByRole = (
	user: UserSchema,
	builder: AbilityBuilder<AppAbility>,
) => void;

export const PermissionsSchema: Record<Role, PermissionsByRole> = {
	ADMIN(user, { can }) {
		can("manage", "Organization", memberOfOrganization(user.id));
		can("manage", "Project", inMemberOrganization(user.id, "Project"));
		can("manage", "Member", inMemberOrganization(user.id, "Member"));
		can("manage", "Invite", inMemberOrganization(user.id, "Invite"));
		can("manage", "Billing");
	},
	MEMBER(user, { can }) {
		can("get", "Organization", memberOfOrganization(user.id));
		can("get", "Member", inMemberOrganization(user.id, "Member"));
		can(["get", "create"], "Project", inMemberOrganization(user.id, "Project"));
		can(["update", "delete"], "Project", {
			...inMemberOrganization(user.id, "Project"),
			ownerId: user.id,
		});
	},
	BILLING(user, { can }) {
		can("get", "Organization", memberOfOrganization(user.id));
		can("manage", "Billing");
	},
};
