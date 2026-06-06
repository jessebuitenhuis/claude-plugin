import { z } from "zod";

export const domainImportance = z.enum(["core", "supporting", "generic"]);

export const evolution = z.enum([
  "genesis",
  "custom-built",
  "product",
  "commodity",
]);

export const actorKind = z.enum(["role", "system"]);

/** Field name to plain-English type, e.g. { completedAt: "Date" }. */
export const dataFields = z.record(z.string(), z.string());

export const ANY_STATE = "*" as const;
