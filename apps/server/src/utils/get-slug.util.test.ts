import { describe, expect, test } from "vitest";
import { getSlug } from "./get-slug.util";

describe("getSlug", () => {
	test("returns the slug when params has a non-empty string slug", () => {
		expect(getSlug({ slug: "acme" })).toBe("acme");
	});

	test("returns undefined when params is null", () => {
		expect(getSlug(null)).toBeUndefined();
	});

	test("returns undefined when params is not an object", () => {
		expect(getSlug("acme")).toBeUndefined();
		expect(getSlug(42)).toBeUndefined();
	});

	test("returns undefined when slug is missing", () => {
		expect(getSlug({})).toBeUndefined();
	});

	test("returns undefined when slug is not a string", () => {
		expect(getSlug({ slug: 123 })).toBeUndefined();
	});

	test("returns undefined when slug is an empty string", () => {
		expect(getSlug({ slug: "" })).toBeUndefined();
	});
});
