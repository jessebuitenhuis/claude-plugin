import type { Aggregate } from "../schema/aggregate.ts";
import { eventsByCommand } from "../projections/eventsByCommand.ts";
import { stateName } from "../projections/stateName.ts";
import { bullets } from "../markdown/bullets.ts";
import { code, codeList } from "../markdown/code.ts";
import { table } from "../markdown/table.ts";

const transitionRows = (aggregate: Aggregate): string[][] =>
  aggregate.transitions.map((t) => [
    stateName(aggregate, t.from),
    code(t.command),
    codeList(t.guards ?? []),
    code(t.produces.join(" / ")),
    stateName(aggregate, t.to),
  ]);

const apiRows = (aggregate: Aggregate): string[][] =>
  [...eventsByCommand(aggregate)].map(([command, events]) => [
    code(command),
    "→",
    code(events.join(" / ")),
  ]);

const correctivePolicies = (aggregate: Aggregate): string[] =>
  aggregate.correctivePolicies.map(
    (policy) => `When ${policy.whenViolated} → emits ${code(policy.emits)} (${policy.rationale})`,
  );

const hasCreateCommand = (aggregate: Aggregate): boolean =>
  aggregate.commands.some((command) => /^Create/.test(command.id));

const lifecycleCheck = (aggregate: Aggregate): string =>
  hasCreateCommand(aggregate)
    ? "creation command present"
    : "no `Create*` command";

export const aggregateDesignCanvas = (aggregate: Aggregate): string => `## Aggregate Design Canvas — ${aggregate.name}

### 1. Name
${aggregate.name}

### 2. Description
${aggregate.description.trim()}

### 3. State Transitions
${table(["From", "Command", "Guards", "Event", "To"], transitionRows(aggregate))}

### 4. Enforced Invariants
_Always-true constraints over aggregate state; verified after applying a command._
${bullets(aggregate.invariants.map((i) => i.statement))}

### 5. Guards
_Command preconditions; checked before applying a command._
${bullets(aggregate.guards.map((g) => `${code(g.id)} — ${g.statement}`))}

### 6. Corrective Policies
${bullets(correctivePolicies(aggregate))}

### 7. Handled Commands & Created Events
${table(["Command", "→", "Event(s)"], apiRows(aggregate))}

_Lifecycle check: ${lifecycleCheck(aggregate)}._

> **Command pipeline:** validate transition → check guards → apply command → verify invariants → save events.`;
