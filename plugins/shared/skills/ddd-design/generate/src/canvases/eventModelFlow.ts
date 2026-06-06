import type { z } from "zod";
import type { DomainModel } from "../schema/domainModel.ts";
import type { flow } from "../schema/flow.ts";
import { code } from "../markdown/code.ts";

type Flow = z.infer<typeof flow>;
type Step = Flow["steps"][number];

const transitionLine = (
  model: DomainModel,
  index: number,
  step: Step & { transition: NonNullable<Step["transition"]> },
): string => {
  const { command, from } = step.transition;
  const aggregate = model.contexts
    .flatMap((context) => context.aggregates)
    .find((a) => a.transitions.some((t) => t.command === command && t.from === from));
  const transition = aggregate?.transitions.find((t) => t.command === command && t.from === from);
  const read = step.readModel ? ` _(read: ${step.readModel})_` : "";
  return `${index}. **${command}** on ${code(aggregate?.id ?? "?")} → ${code(transition?.produces.join(", ") ?? "?")}${read}`;
};

const reactionLine = (model: DomainModel, index: number, reactionId: string): string => {
  const reaction = model.contexts
    .flatMap((context) => context.reactions)
    .find((r) => r.id === reactionId);
  const condition = reaction?.condition ? ` (${reaction.condition})` : "";
  return `${index}. _policy_: whenever ${code(reaction?.whenEvent ?? "?")}${condition} → ${code(reaction?.thenCommand ?? "?")} _(→ ${reaction?.inContext ?? "?"})_`;
};

const stepLine = (model: DomainModel, step: Step, index: number): string => {
  const position = index + 1;
  if (step.transition) return transitionLine(model, position, { ...step, transition: step.transition });
  return reactionLine(model, position, step.reaction ?? "");
};

export const eventModelFlow = (model: DomainModel, flow: Flow): string => `## Event Model — ${flow.name}
_Trigger: ${flow.trigger}_

### Timeline
${flow.steps.map((step, index) => stepLine(model, step, index)).join("\n")}`;
