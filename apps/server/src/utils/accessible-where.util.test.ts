import type { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { UnauthorizedError } from "@/shared/_errors/unauthorized-error";

const ofTypeMock = vi.fn((_model: string) => ({
	id: { in: ["accessible-id"] },
}));
const accessibleByMock = vi.fn((_ability: unknown, _action: string) => ({
	ofType: ofTypeMock,
}));

vi.mock("@sass-boiler-plate/auth", () => ({
	accessibleBy: (...args: unknown[]) => accessibleByMock(...args),
}));

const { assertWriteAllowed, constrainWhere } = await import(
	"./accessible-where.util"
);

const createRequest = (
	overrides: Partial<FastifyRequest> = {},
): FastifyRequest =>
	({
		ability: { can: () => true },
		organization: undefined,
		...overrides,
	}) as FastifyRequest;

describe("constrainWhere", () => {
	beforeEach(() => {
		ofTypeMock.mockClear();
		accessibleByMock.mockClear();
	});

	test("throws when the request has no ability", () => {
		const request = createRequest({ ability: undefined });

		expect(() => constrainWhere(request, "get", "Project")).toThrow(
			UnauthorizedError,
		);
	});

	test("returns ability conditions when no organization is present", () => {
		const request = createRequest();
		const where = constrainWhere(request, "get", "Project");

		expect(accessibleByMock).toHaveBeenCalledWith(request.ability, "get");
		expect(ofTypeMock).toHaveBeenCalledWith("Project");
		expect(where).toEqual({
			AND: [{ id: { in: ["accessible-id"] } }],
		});
	});

	test("injects organization id for Organization model", () => {
		const request = createRequest({
			organization: { id: "org-1" },
		} as Partial<FastifyRequest>);
		const where = constrainWhere(request, "get", "Organization");

		expect(where).toEqual({
			AND: [{ id: { in: ["accessible-id"] } }, { id: "org-1" }],
		});
	});

	test("injects organizationId for non-Organization models", () => {
		const request = createRequest({
			organization: { id: "org-1" },
		} as Partial<FastifyRequest>);
		const where = constrainWhere(request, "get", "Project");

		expect(where).toEqual({
			AND: [
				{ id: { in: ["accessible-id"] } },
				{ organizationId: "org-1" },
			],
		});
	});

	test("appends extra where conditions when provided", () => {
		const request = createRequest();
		const where = constrainWhere(request, "update", "Project", {
			id: "project-1",
		});

		expect(where).toEqual({
			AND: [{ id: { in: ["accessible-id"] } }, { id: "project-1" }],
		});
	});
});

describe("assertWriteAllowed", () => {
	test("does nothing when count is greater than zero", () => {
		expect(() => assertWriteAllowed(1)).not.toThrow();
	});

	test("throws when count is zero", () => {
		expect(() => assertWriteAllowed(0)).toThrow(UnauthorizedError);
	});
});
