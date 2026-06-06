import { z } from "zod";

const transitionStep = z.object({
  command: z.string(),
  from: z.string(),
});

/** One authored step: either a transition or a reaction, optionally reading a model. */
export const flowStep = z
  .object({
    transition: transitionStep.optional(),
    reaction: z.string().optional(),
    readModel: z.string().optional(),
  })
  .refine((step) => Boolean(step.transition) !== Boolean(step.reaction), {
    message: "a flow step is either a transition or a reaction, not both",
  });

export const flow = z.object({
  name: z.string(),
  trigger: z.string(),
  steps: z.array(flowStep),
});

export type Flow = z.infer<typeof flow>;
