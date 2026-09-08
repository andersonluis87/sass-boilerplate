import { z } from "zod";

export const MemberSubject = z.tuple([
	z.union([
		z.literal("manage"),
		z.literal("get"),
		z.literal("update"),
		z.literal("delete"),
	]),
	z.literal("Member"),
]);

export type MemberSubject = z.infer<typeof MemberSubject>;
