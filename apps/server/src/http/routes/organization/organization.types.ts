import type { Member } from "@sass-boiler-plate/db";

export type OrganizationListItem = {
	id: string;
	name: string;
	slug: string;
	avatarUrl: string | null;
	members: Pick<Member, "role">[];
};
