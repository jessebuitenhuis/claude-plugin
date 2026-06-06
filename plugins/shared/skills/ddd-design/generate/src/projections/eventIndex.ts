import type { DomainModel } from "../schema/domainModel.ts";

/** Every event id declared anywhere in the model. */
export const eventIndex = (model: DomainModel): Set<string> => {
  const events = new Set<string>();
  for (const context of model.contexts)
    for (const aggregate of context.aggregates)
      for (const event of aggregate.events) events.add(event.id);
  return events;
};

export const contextIndex = (model: DomainModel): Set<string> =>
  new Set(model.contexts.map((context) => context.id));
