import type { IntegrityIssue } from "../integrity/issue.ts";
import { formatIssues } from "../integrity/issue.ts";

export class ModelError extends Error {
  constructor(readonly issues: readonly IntegrityIssue[]) {
    super(`model invalid:\n${formatIssues(issues)}`);
    this.name = "ModelError";
  }
}
