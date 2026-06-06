import type { DomainModel } from "../schema/domainModel.ts";
import { contextIndex, eventIndex } from "../projections/eventIndex.ts";
import { checkContext } from "./checkContext.ts";
import { checkFlows } from "./checkFlows.ts";
import { checkRelationships } from "./checkRelationships.ts";
import type { IntegrityIssue } from "./issue.ts";

/** Cross-reference integrity over the assembled model. Shape and vocab are already Zod-checked. */
export const checkIntegrity = (model: DomainModel): IntegrityIssue[] => {
  const allEvents = eventIndex(model);
  const allContexts = contextIndex(model);
  return [
    ...model.contexts.flatMap((context) =>
      checkContext(context, allEvents, allContexts),
    ),
    ...checkRelationships(model, allContexts),
    ...checkFlows(model),
  ];
};
