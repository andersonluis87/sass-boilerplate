import {
	type AccessibleModel,
	type AppAction,
	accessibleBy,
	type WhereInput,
} from "@sass-boiler-plate/auth";
import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";

const currentOrgPin = (
	model: AccessibleModel,
	organizationId: string,
): WhereInput<AccessibleModel> => {
	if (model === "Organization") {
		return { id: organizationId } as WhereInput<"Organization">;
	}

	return { organizationId } as WhereInput<AccessibleModel>;
};

export const constrainWhere = <TModel extends AccessibleModel>(
	request: FastifyRequest,
	action: AppAction,
	model: TModel,
	extra?: WhereInput<TModel>,
) => {
	if (!request.ability) {
		throw new UnauthorizedError("You are not allowed to perform this action");
	}

	const conditions: WhereInput<TModel>[] = [
		accessibleBy(request.ability, action).ofType(model),
	];

	if (request.organization?.id) {
		conditions.push(
			currentOrgPin(model, request.organization.id) as WhereInput<TModel>,
		);
	}

	if (extra) {
		conditions.push(extra);
	}

	return {
		AND: conditions,
	};
};

export const assertWriteAllowed = (count: number) => {
	if (count === 0) {
		throw new UnauthorizedError("You are not allowed to perform this action");
	}
};
