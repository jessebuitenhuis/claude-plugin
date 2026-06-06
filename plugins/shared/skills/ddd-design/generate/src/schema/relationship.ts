import { z } from "zod";

/** A context-map edge: a strategic relationship between two contexts. */
export const relationship = z.object({
  upstream: z.string(),
  downstream: z.string(),
  pattern: z.string(),
  integration: z.string(),
});
