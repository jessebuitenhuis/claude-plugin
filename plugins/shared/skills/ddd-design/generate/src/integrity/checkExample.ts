import type { z } from "zod";
import type { example } from "../schema/aggregate.ts";
import { looksLikeEvent } from "../projections/looksLikeEvent.ts";
import type { AggregateIds } from "./aggregateIds.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

type Example = z.infer<typeof example>;

const checkThen = (
  where: string,
  example: Example,
  events: Set<string>,
): IntegrityIssue[] =>
  example.then
    .filter((entry) => looksLikeEvent(entry) && !events.has(entry))
    .map((entry) =>
      issue(where, `example '${example.name}' then '${entry}' looks like an event but is undeclared`),
    );

export const checkExample = (
  where: string,
  example: Example,
  ids: AggregateIds,
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  if (!ids.commands.has(example.when))
    issues.push(issue(where, `example '${example.name}' when '${example.when}' not a declared command`));
  if (example.rule && !ids.rules.has(example.rule))
    issues.push(issue(where, `example '${example.name}' rule '${example.rule}' not a declared invariant/guard`));
  return [...issues, ...checkThen(where, example, ids.events)];
};
