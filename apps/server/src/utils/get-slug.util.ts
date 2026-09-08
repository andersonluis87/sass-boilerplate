export function getSlug(params: unknown): string | undefined {
	if (!params || typeof params !== "object") {
		return undefined;
	}

	if (!("slug" in params)) {
		return undefined;
	}

	const slug = (params as { slug: unknown }).slug;
	if (typeof slug !== "string" || slug.length === 0) {
		return undefined;
	}

	return slug;
}
