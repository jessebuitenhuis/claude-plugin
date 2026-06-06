import type { AggregateIds } from "./aggregateIds.ts";
import { issue, type IntegrityIssue } from "./issue.ts";
import type { operation, transition } from "../schema/aggregate.ts";
import type { z } from "zod";

type CommandUsage = z.infer<typeof transition> | z.infer<typeof operation>;

/** The command/produces/guards checks shared by transitions and operations. */
export const checkCommandUsage = (
  where: string,
  label: string,
  usage: CommandUsage,
  ids: AggregateIds,
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  if (!ids.commands.has(usage.command))
    issues.push(issue(where, `${label} command '${usage.command}' not declared`));
  for (const event of usage.produces)
    if (!ids.events.has(event))
      issues.push(issue(where, `${label} produces unknown event '${event}'`));
  for (const guard of usage.guards ?? [])
    if (!ids.guards.has(guard))
      issues.push(issue(where, `${label} guard '${guard}' not declared`));
  return issues;
};
