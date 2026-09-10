import { describe, expect, test } from "vitest";
import { createSlug } from "./create-slug.util";

describe("createSlug", () => {
	test("lowercases and replaces spaces with hyphens", () => {
		expect(createSlug("Hello World")).toBe("hello-world");
	});

	test("trims leading and trailing whitespace", () => {
		expect(createSlug("  Foo   Bar  ")).toBe("foo-bar");
	});

	test("removes non-word characters", () => {
		expect(createSlug("Hello@World!")).toBe("helloworld");
	});

	test("keeps existing hyphens between words", () => {
		expect(createSlug("CamelCase Text")).toBe("camelcase-text");
	});
});
