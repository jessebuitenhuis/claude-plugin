import { z } from "zod";
import { context } from "./context.ts";
import { flow } from "./flow.ts";
import { relationship } from "./relationship.ts";

/** The whole assembled model: the single source of truth every canvas projects from. */
export const domainModel = z.object({
  relationships: z.array(relationship).default([]),
  contexts: z.array(context),
  flows: z.array(flow).default([]),
});

export type DomainModel = z.infer<typeof domainModel>;
