import { z } from "zod";

export const getEmailDomain = (value: string): string => {
	const email = z.email().parse(value);
	const atIndex = email.lastIndexOf("@");

	return email.slice(atIndex + 1);
};
