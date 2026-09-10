import { describe, expect, test } from "vitest";
import { ZodError } from "zod";
import { getEmailDomain } from "./get-email-domain.util";

describe("getEmailDomain", () => {
	test("extracts the domain from a valid email", () => {
		expect(getEmailDomain("user@example.com")).toBe("example.com");
	});

	test("extracts the domain from an email with subdomains", () => {
		expect(getEmailDomain("user@mail.example.com")).toBe("mail.example.com");
	});

	test("throws when the value is not an email", () => {
		expect(() => getEmailDomain("not-an-email")).toThrow(ZodError);
	});

	test("throws when the value is empty", () => {
		expect(() => getEmailDomain("")).toThrow(ZodError);
	});
});
