import { z } from "zod";
import { dataFields } from "./primitives.ts";

export const state = z.object({
  id: z.string(),
  name: z.string(),
});

/** Commands and events share a shape; they differ only by role and tense. */
const message = z.object({
  id: z.string(),
  data: dataFields.optional(),
});
export const command = message;
export const event = message;

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

/** A concrete case. `when` is always a command; `rule` links an invariant or guard. */
export const example = z.object({
  name: z.string(),
  rule: z.string().optional(),
  given: z.string(),
  when: z.string(),
  then: z.array(z.string()).min(1),
});

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
