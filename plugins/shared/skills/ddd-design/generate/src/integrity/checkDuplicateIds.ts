import type { Aggregate } from "../schema/aggregate.ts";
import type { DomainModel } from "../schema/domainModel.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

const duplicates = (ids: readonly string[]): string[] => {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) repeated.add(id);
    seen.add(id);
  }
  return [...repeated];
};

const report = (
  where: string,
  label: string,
  ids: readonly string[],
): IntegrityIssue[] =>
  duplicates(ids).map((id) => issue(where, `duplicate ${label} id '${id}'`));

const checkAggregateIds = (
  contextId: string,
  aggregate: Aggregate,
): IntegrityIssue[] => {
  const where = `${contextId}/${aggregate.id}`;
  return [
    ...report(where, "state", aggregate.states.map((s) => s.id)),
    ...report(where, "command", aggregate.commands.map((c) => c.id)),
    ...report(where, "event", aggregate.events.map((e) => e.id)),
    ...report(where, "guard", aggregate.guards.map((g) => g.id)),
    ...report(where, "invariant", aggregate.invariants.map((i) => i.id)),
  ];
};

export const checkDuplicateIds = (model: DomainModel): IntegrityIssue[] => [
  ...report("contexts", "context", model.contexts.map((c) => c.id)),
  ...model.contexts.flatMap((context) => [
    ...report(context.id, "aggregate", context.aggregates.map((a) => a.id)),
    ...context.aggregates.flatMap((a) => checkAggregateIds(context.id, a)),
  ]),
];
