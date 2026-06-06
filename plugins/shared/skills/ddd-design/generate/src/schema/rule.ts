import { z } from "zod";

/** Always-true constraint over aggregate state; verified after a command. */
export const invariant = z.object({
  id: z.string(),
  statement: z.string(),
});

/** Command precondition; checked before a command is applied. */
export const guard = z.object({
  id: z.string(),
  statement: z.string(),
});

/** Records a fact instead of locking when an invariant cannot be met. */
export const correctivePolicy = z.object({
  whenViolated: z.string(),
  emits: z.string(),
  rationale: z.string(),
});
