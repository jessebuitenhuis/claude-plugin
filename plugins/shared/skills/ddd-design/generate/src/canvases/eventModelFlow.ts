import type { DomainModel } from "../schema/domainModel.ts";
import type { Flow, FlowStep } from "../schema/flow.ts";
import { ANY_STATE } from "../schema/primitives.ts";
import { code } from "../markdown/code.ts";

type TransitionStep = Extract<FlowStep, { transition: object }>;

const matchesTransition = (
  t: { command: string; from: string },
  command: string,
  from: string,
): boolean => t.command === command && (t.from === from || t.from === ANY_STATE);

const transitionLine = (
  model: DomainModel,
  index: number,
  step: TransitionStep,
): string => {
  const { command, from } = step.transition;
  const aggregate = model.contexts
    .flatMap((context) => context.aggregates)
    .find((a) => a.transitions.some((t) => matchesTransition(t, command, from)));
  const transition = aggregate?.transitions.find((t) => matchesTransition(t, command, from));
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

const stepLine = (model: DomainModel, step: FlowStep, index: number): string => {
  const position = index + 1;
  if ("transition" in step) return transitionLine(model, position, step);
  return reactionLine(model, position, step.reaction);
};

export const eventModelFlow = (model: DomainModel, flow: Flow): string => `## Event Model — ${flow.name}
_Trigger: ${flow.trigger}_

### Timeline
${flow.steps.map((step, index) => stepLine(model, step, index)).join("\n")}`;
