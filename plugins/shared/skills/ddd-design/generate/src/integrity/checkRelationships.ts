import type { DomainModel } from "../schema/domainModel.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

export const checkRelationships = (
  model: DomainModel,
  allContexts: Set<string>,
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  for (const { upstream, downstream } of model.relationships) {
    if (!allContexts.has(upstream))
      issues.push(issue("relationships", `upstream '${upstream}' unknown`));
    if (!allContexts.has(downstream))
      issues.push(issue("relationships", `downstream '${downstream}' unknown`));
  }
  return issues;
};
