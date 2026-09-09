import type { MemberWithUser } from "../types/member-with-user";

export function membersWithRoles(members: MemberWithUser[]) {
	// TODO: Remove passwordHash when omitted by default
	return members.map(({ user: { id: userId, ...user }, ...member }) => {
		return {
			...user,
			...member,
			userId,
		};
	});
}
