import type { Aggregate } from "../schema/aggregate.ts";
import { aggregateIds } from "./aggregateIds.ts";
import { checkCommandUsage } from "./checkCommandUsage.ts";
import { checkExample } from "./checkExample.ts";
import { checkTransition } from "./checkTransition.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

export const checkAggregate = (
  contextId: string,
  aggregate: Aggregate,
): IntegrityIssue[] => {
  const where = `${contextId}/${aggregate.id}`;
  const ids = aggregateIds(aggregate);

  const initial = ids.states.has(aggregate.initial)
    ? []
    : [issue(where, `initial state '${aggregate.initial}' not declared`)];

  const corrective = aggregate.correctivePolicies
    .filter((policy) => !ids.events.has(policy.emits))
    .map((policy) => issue(where, `corrective policy emits unknown event '${policy.emits}'`));

  return [
    ...initial,
    ...aggregate.transitions.flatMap((t) => checkTransition(where, t, ids)),
    ...aggregate.operations.flatMap((o) => checkCommandUsage(where, "operation", o, ids)),
    ...corrective,
    ...aggregate.examples.flatMap((e) => checkExample(where, e, ids)),
  ];
};
