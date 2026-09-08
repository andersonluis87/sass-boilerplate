import type { AppAbilities } from "../schemas/abilities.schema";

type SubjectName<S> = S extends string
	? S
	: S extends { __typename: infer N }
		? N
		: never;

export type RouteCan = AppAbilities extends infer U
	? U extends readonly [infer Action, infer Subject]
		? readonly [Action, SubjectName<Subject>]
		: never
	: never;
