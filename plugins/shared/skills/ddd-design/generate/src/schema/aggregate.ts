import { z } from "zod";
import { command, event } from "./message.ts";
import { correctivePolicy, guard, invariant } from "./rule.ts";
import { example } from "./example.ts";
import { operation, transition } from "./lifecycle.ts";
import { state } from "./state.ts";

export const aggregate = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  initial: z.string(),
  states: z.array(state),
  commands: z.array(command),
  events: z.array(event),
  invariants: z.array(invariant).default([]),
  guards: z.array(guard).default([]),
  correctivePolicies: z.array(correctivePolicy).default([]),
  transitions: z.array(transition).default([]),
  operations: z.array(operation).default([]),
  examples: z.array(example).default([]),
});

export type Aggregate = z.infer<typeof aggregate>;
