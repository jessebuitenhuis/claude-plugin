import type { Aggregate } from "../schema/aggregate.ts";
import { ANY_STATE } from "../schema/primitives.ts";

export const stateName = (aggregate: Aggregate, id: string): string => {
  if (id === ANY_STATE) return "any active";
  return aggregate.states.find((state) => state.id === id)?.name ?? id;
};
