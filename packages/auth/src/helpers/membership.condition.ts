import type { WhereInput } from "../casl-prisma";

export const memberOfOrganization = (
	userId: string,
): WhereInput<"Organization"> => ({
	members: {
		some: {
			userId,
		},
	},
});

export const inMemberOrganization = <
	TModel extends "Project" | "Member" | "Invite",
>(
	userId: string,
	_model: TModel,
): WhereInput<TModel> =>
	({
		organization: {
			members: {
				some: {
					userId,
				},
			},
		},
	}) as WhereInput<TModel>;
