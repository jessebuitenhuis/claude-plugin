import type { ZodError } from "zod";
import { resolvePath } from "./resolvePath.ts";

/** A schema validation failure, with each issue located by named id rather than array index. */
export class SchemaError extends Error {
  constructor(raw: unknown, error: ZodError) {
    super(SchemaError._describe(raw, error));
    this.name = "SchemaError";
  }

  private static _describe(raw: unknown, error: ZodError): string {
    const lines = error.issues.map(
      (issue) => `  - [${resolvePath(raw, issue.path) || "(root)"}] ${issue.message}`,
    );
    return `model does not match schema:\n${lines.join("\n")}`;
  }
}
