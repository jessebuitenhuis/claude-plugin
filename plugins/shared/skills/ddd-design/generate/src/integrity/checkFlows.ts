import type { DomainModel } from "../schema/domainModel.ts";
import type { FlowStep } from "../schema/flow.ts";
import { ANY_STATE } from "../schema/primitives.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

const allAggregates = (model: DomainModel) =>
  model.contexts.flatMap((context) => context.aggregates);

const transitionExists = (
  model: DomainModel,
  command: string,
  from: string,
): boolean =>
  allAggregates(model).some((aggregate) =>
    aggregate.transitions.some(
      (t) => t.command === command && (t.from === from || t.from === ANY_STATE),
    ),
  );

const reactionExists = (model: DomainModel, id: string): boolean =>
  model.contexts.some((context) =>
    context.reactions.some((reaction) => reaction.id === id),
  );

const checkStep = (
  model: DomainModel,
  flowName: string,
  step: FlowStep,
): IntegrityIssue[] => {
  if ("transition" in step) {
    const { command, from } = step.transition;
    if (transitionExists(model, command, from)) return [];
    return [issue(`flow:${flowName}`, `missing transition ${command}@${from}`)];
  }
  if (reactionExists(model, step.reaction)) return [];
  return [issue(`flow:${flowName}`, `missing reaction '${step.reaction}'`)];
};

export const checkFlows = (model: DomainModel): IntegrityIssue[] =>
  model.flows.flatMap((flow) =>
    flow.steps.flatMap((step) => checkStep(model, flow.name, step)),
  );
