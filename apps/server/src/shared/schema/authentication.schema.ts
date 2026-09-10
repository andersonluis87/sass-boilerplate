import { z } from "zod";
import { UserBaseSchema } from "@/shared/schema/user.schema";

export const PasswordSchema = z.string().min(8);

export const AuthTokenSchema = z.object({
	token: z.string(),
});

export const SignUpSchema = z.object({
	name: z.string().nonempty(),
	email: z.email(),
	password: PasswordSchema,
});

export const SignInSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export const GithubCodeSchema = z.object({
	code: z.string().nonempty(),
});

export const RequestPasswordRecoverSchema = UserBaseSchema.pick({
	email: true,
});

export const ResetPasswordSchema = z.object({
	code: z.uuid(),
	password: PasswordSchema,
});

export type SignUp = z.infer<typeof SignUpSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
export type GithubCode = z.infer<typeof GithubCodeSchema>;
export type RequestPasswordRecover = z.infer<
	typeof RequestPasswordRecoverSchema
>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
