import { z } from "zod";

/** Stateless cross-context listener: one event drives one command elsewhere. */
export const reaction = z.object({
  id: z.string(),
  whenEvent: z.string(),
  condition: z.string().optional(),
  thenCommand: z.string(),
  inContext: z.string(),
});
