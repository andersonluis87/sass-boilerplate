import { z } from "zod";

import { Role } from "../schemas/role.schema";

export const UserSchema = z.object({
	id: z.uuid(),
	role: Role,
});

export type UserSchema = z.infer<typeof UserSchema>;
