import type { Context } from "../schema/context.ts";
import { eventsByCommand } from "../projections/eventsByCommand.ts";
import { bullets } from "../markdown/bullets.ts";
import { code } from "../markdown/code.ts";

const commandSlices = (context: Context): string[] =>
  context.aggregates.flatMap((aggregate) =>
    [...eventsByCommand(aggregate)].map(
      ([command, events]) =>
        `**${command}** → ${code(aggregate.id)} → ${code(events.join(", "))}`,
    ),
  );

const projectionSlices = (context: Context): string[] =>
  context.readModels.map(
    (readModel) =>
      `**${readModel.id}** — ${readModel.description}\n  - folds ${code(readModel.folds.join(", "))}`,
  );

const automationSlices = (context: Context): string[] =>
  context.reactions.map(
    (reaction) =>
      `**${reaction.id}**: ${code(reaction.whenEvent)}${reaction.condition ? ` (${reaction.condition})` : ""} → ${code(reaction.thenCommand)} _(→ ${reaction.inContext})_`,
  );

export const eventModelSlices = (context: Context): string => `## Event Model — Slices (${context.name})

**Command slices**
${bullets(commandSlices(context))}

**Projection slices (read models)**
${bullets(projectionSlices(context))}

**Automation slices**
${bullets(automationSlices(context))}`;
