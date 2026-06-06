import { z } from "zod";

/** Changes the aggregate's lifecycle state. `from` may be a state id or "*". */
export const transition = z.object({
  from: z.string(),
  command: z.string(),
  produces: z.array(z.string()),
  to: z.string(),
  guards: z.array(z.string()).optional(),
});

/** Changes attributes without changing the lifecycle state. */
export const operation = z.object({
  command: z.string(),
  produces: z.array(z.string()),
  guards: z.array(z.string()).optional(),
});
