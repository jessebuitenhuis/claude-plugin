import type { DomainModel } from "../schema/domainModel.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

const allAggregates = (model: DomainModel) =>
  model.contexts.flatMap((context) => context.aggregates);

const transitionExists = (
  model: DomainModel,
  command: string,
  from: string,
): boolean =>
  allAggregates(model).some((aggregate) =>
    aggregate.transitions.some((t) => t.command === command && t.from === from),
  );

const reactionExists = (model: DomainModel, id: string): boolean =>
  model.contexts.some((context) =>
    context.reactions.some((reaction) => reaction.id === id),
  );

export const checkFlows = (model: DomainModel): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  for (const flow of model.flows)
    for (const step of flow.steps) {
      if (step.transition && !transitionExists(model, step.transition.command, step.transition.from))
        issues.push(issue(`flow:${flow.name}`, `missing transition ${step.transition.command}@${step.transition.from}`));
      if (step.reaction && !reactionExists(model, step.reaction))
        issues.push(issue(`flow:${flow.name}`, `missing reaction '${step.reaction}'`));
    }
  return issues;
};
