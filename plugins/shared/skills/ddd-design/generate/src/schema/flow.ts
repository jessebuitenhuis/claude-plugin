import { z } from "zod";

/** A step that drives a transition, optionally surfacing a read model. */
const transitionStep = z
  .object({
    transition: z.object({ command: z.string(), from: z.string() }),
    readModel: z.string().optional(),
  })
  .strict();

/** A step that fires a reaction. */
const reactionStep = z.object({ reaction: z.string() }).strict();

/** Exactly one of transition or reaction; `.strict()` rejects the other key and the empty case. */
export const flowStep = z.union([transitionStep, reactionStep]);

export const flow = z.object({
  name: z.string(),
  trigger: z.string(),
  steps: z.array(flowStep),
});

export type Flow = z.infer<typeof flow>;
export type FlowStep = z.infer<typeof flowStep>;
