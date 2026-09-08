import type { Member } from "@sass-boiler-plate/db";

interface OrganizationListItem {
	id: string;
	name: string;
	slug: string;
	avatarUrl: string | null;
	members: Pick<Member, "role">[];
}

export function organizationWithRoleMapper(
	organizations: OrganizationListItem[],
) {
	if (organizations.length === 0) {
		return [];
	}

	return organizations.map(({ members, ...organization }) => {
		return {
			...organization,
			role: members[0]?.role ?? "MEMBER",
		};
	});
}
