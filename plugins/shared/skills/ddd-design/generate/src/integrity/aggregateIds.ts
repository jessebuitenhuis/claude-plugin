import type { Aggregate } from "../schema/aggregate.ts";

export interface AggregateIds {
  readonly states: Set<string>;
  readonly commands: Set<string>;
  readonly events: Set<string>;
  readonly guards: Set<string>;
  readonly rules: Set<string>;
}

const ids = <T extends { id: string }>(items: readonly T[]): Set<string> =>
  new Set(items.map((item) => item.id));

export const aggregateIds = (aggregate: Aggregate): AggregateIds => {
  const guards = ids(aggregate.guards);
  return {
    states: ids(aggregate.states),
    commands: ids(aggregate.commands),
    events: ids(aggregate.events),
    guards,
    rules: new Set([...ids(aggregate.invariants), ...guards]),
  };
};
