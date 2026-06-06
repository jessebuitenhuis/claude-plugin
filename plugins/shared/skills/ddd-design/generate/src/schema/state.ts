import { z } from "zod";

export const state = z.object({
  id: z.string(),
  name: z.string(),
  /** A domain-defined lifecycle phase used to group states on the aggregate canvas (e.g. unstarted, started, done). */
  category: z.string().optional(),
});
