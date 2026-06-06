import { ZodError } from "zod";
import { ModelError } from "../load/modelError.ts";

const formatZod = (error: ZodError): string => {
  const lines = error.issues.map(
    (issue) => `  - [${issue.path.join(".") || "(root)"}] ${issue.message}`,
  );
  return `model does not match schema:\n${lines.join("\n")}`;
};

export const formatError = (error: unknown): string => {
  if (error instanceof ModelError) return error.message;
  if (error instanceof ZodError) return formatZod(error);
  return error instanceof Error ? error.message : String(error);
};
