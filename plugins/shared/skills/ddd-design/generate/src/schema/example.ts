import { z } from "zod";

/** A concrete case. `when` is always a command; `rule` links an invariant or guard. */
export const example = z.object({
  name: z.string(),
  rule: z.string().optional(),
  given: z.string(),
  when: z.string(),
  then: z.array(z.string()),
});
