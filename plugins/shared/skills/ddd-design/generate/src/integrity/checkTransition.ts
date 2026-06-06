import type { z } from "zod";
import type { transition } from "../schema/lifecycle.ts";
import { ANY_STATE } from "../schema/primitives.ts";
import type { AggregateIds } from "./aggregateIds.ts";
import { checkCommandUsage } from "./checkCommandUsage.ts";
import { issue, type IntegrityIssue } from "./issue.ts";

type Transition = z.infer<typeof transition>;

const knownState = (states: Set<string>, id: string): boolean =>
  id === ANY_STATE || states.has(id);

export const checkTransition = (
  where: string,
  transition: Transition,
  ids: AggregateIds,
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  if (!knownState(ids.states, transition.from))
    issues.push(issue(where, `transition from '${transition.from}' not a declared state`));
  if (!ids.states.has(transition.to))
    issues.push(issue(where, `transition to '${transition.to}' not a declared state`));
  return [...issues, ...checkCommandUsage(where, "transition", transition, ids)];
};
