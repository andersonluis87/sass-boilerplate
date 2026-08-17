import { z } from "zod";

import { RoleSchema } from "../schemas/role.schema";

export const UserSchema = z.object({
	id: z.uuid(),
	role: RoleSchema,
});

export type UserSchema = z.infer<typeof UserSchema>;
