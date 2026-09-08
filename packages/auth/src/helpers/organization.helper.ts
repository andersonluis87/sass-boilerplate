import { subject } from "@casl/ability";
import type { Organization } from "../models/organization.model";

export function toOrganizationSubject(
	organization: Pick<Organization, "id" | "ownerId">,
) {
	return subject("Organization", organization);
}
