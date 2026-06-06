import type { Context } from "../schema/context.ts";
import { bullets } from "../markdown/bullets.ts";
import { code } from "../markdown/code.ts";
import { table } from "../markdown/table.ts";

const inboundRows = (context: Context): string[][] => [
  ...context.aggregates.flatMap((a) =>
    a.commands.map((command) => [code(command.id), "Command"]),
  ),
  ...context.readModels.map((readModel) => [code(`Get${readModel.id}`), "Query"]),
];

const outboundRows = (context: Context): string[][] => {
  const commands = context.reactions
    .filter((reaction) => reaction.inContext !== context.id)
    .map((reaction) => [code(reaction.thenCommand), "Command", reaction.inContext]);
  const events = [
    ...new Set(context.reactions.map((r) => `${r.whenEvent}::${r.inContext}`)),
  ].map((entry) => {
    const [event, target] = entry.split("::");
    return [code(event ?? ""), "Event", target ?? ""];
  });
  return [...commands, ...events];
};

const businessDecisions = (context: Context): string[] => [
  ...context.aggregates.flatMap((a) => [
    ...a.invariants.map((invariant) => invariant.statement),
    ...a.guards.map((guard) => guard.statement),
  ]),
  ...context.reactions.map(
    (r) =>
      `Whenever ${code(r.whenEvent)}${r.condition ? ` (${r.condition})` : ""} → ${code(r.thenCommand)}`,
  ),
];

const languageRows = (context: Context): string[][] => [
  ...context.language.map((term) => [code(term.term), term.kind, term.definition]),
  ...context.actors.map((actor) => [code(actor.id), actor.kind, actor.definition]),
];

export const boundedContextCanvas = (context: Context): string => `## Bounded Context Canvas — ${context.name}

### Purpose
${context.purpose?.trim() ?? "_TBD_"}

### Strategic Classification
- **Domain importance:** ${context.classification.domain}
- **Business model role:** ${context.classification.businessModel}
- **Evolution:** ${context.classification.evolution}

### Domain Roles
${bullets(context.roles)}

### Inbound Communication
${table(["Message", "Type"], inboundRows(context))}

### Outbound Communication
${table(["Message", "Type", "To"], outboundRows(context))}

### Ubiquitous Language
${table(["Term", "Kind", "Definition"], languageRows(context))}

### Business Decisions
${bullets(businessDecisions(context))}`;
