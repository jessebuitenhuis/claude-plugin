import type { Aggregate } from "../schema/aggregate.ts";

/** The events each command produces, merged across transitions and operations. */
export const eventsByCommand = (
  aggregate: Aggregate,
): Map<string, string[]> => {
  const byCommand = new Map<string, Set<string>>();
  for (const { command, produces } of [
    ...aggregate.transitions,
    ...aggregate.operations,
  ]) {
    const events = byCommand.get(command) ?? new Set<string>();
    produces.forEach((event) => events.add(event));
    byCommand.set(command, events);
  }
  return new Map(
    [...byCommand].map(([command, events]) => [command, [...events]]),
  );
};
