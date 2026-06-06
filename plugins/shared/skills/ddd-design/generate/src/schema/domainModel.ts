import { z } from "zod";
import { context } from "./context.ts";
import { flow } from "./flow.ts";

/** A context-map edge: a strategic relationship between two contexts. */
export const relationship = z.object({
  upstream: z.string(),
  downstream: z.string(),
  pattern: z.string(),
  integration: z.string(),
});

/** The whole assembled model: the single source of truth every canvas projects from. */
export const domainModel = z.object({
  relationships: z.array(relationship).default([]),
  contexts: z.array(context),
  flows: z.array(flow).default([]),
});

export type DomainModel = z.infer<typeof domainModel>;
