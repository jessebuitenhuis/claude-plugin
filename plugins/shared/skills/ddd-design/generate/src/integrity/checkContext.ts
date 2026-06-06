import type { Context } from "../schema/context.ts";
import { checkAggregate } from "./checkAggregate.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

const checkReadModels = (
  context: Context,
  allEvents: Set<string>,
): IntegrityIssue[] =>
  context.readModels.flatMap((readModel) =>
    readModel.folds
      .filter((event) => !allEvents.has(event))
      .map((event) =>
        issue(context.id, `read model '${readModel.id}' folds unknown event '${event}'`),
      ),
  );

const checkReactions = (
  context: Context,
  allEvents: Set<string>,
  allContexts: Set<string>,
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  for (const reaction of context.reactions) {
    if (!allEvents.has(reaction.whenEvent))
      issues.push(issue(context.id, `reaction '${reaction.id}' whenEvent '${reaction.whenEvent}' unknown`));
    if (!allContexts.has(reaction.inContext))
      issues.push(issue(context.id, `reaction '${reaction.id}' inContext '${reaction.inContext}' unknown`));
  }
  return issues;
};

export const checkContext = (
  context: Context,
  allEvents: Set<string>,
  allContexts: Set<string>,
): IntegrityIssue[] => [
  ...context.aggregates.flatMap((aggregate) => checkAggregate(context.id, aggregate)),
  ...checkReadModels(context, allEvents),
  ...checkReactions(context, allEvents, allContexts),
];
