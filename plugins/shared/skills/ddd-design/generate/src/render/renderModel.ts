import type { Context } from "../schema/context.ts";
import type { DomainModel } from "../schema/domainModel.ts";
import { aggregateDesignCanvas } from "../canvases/aggregateDesignCanvas.ts";
import { boundedContextCanvas } from "../canvases/boundedContextCanvas.ts";
import { contextMap } from "../canvases/contextMap.ts";
import { eventModelFlow } from "../canvases/eventModelFlow.ts";
import { eventModelSlices } from "../canvases/eventModelSlices.ts";
import { exampleMap } from "../canvases/exampleMap.ts";
import { isModeled } from "../projections/isModeled.ts";
import type { OutputFile } from "./outputFile.ts";
import { slug } from "./slug.ts";

const aggregateFile = (context: Context, aggregateId: string): OutputFile => {
  const aggregate = context.aggregates.find((a) => a.id === aggregateId);
  if (!aggregate) throw new Error(`unknown aggregate '${aggregateId}'`);
  return {
    path: `${context.id}/${aggregate.id}.aggregate.md`,
    content: `${aggregateDesignCanvas(aggregate)}\n\n${exampleMap(aggregate)}`,
  };
};

const contextFiles = (context: Context): OutputFile[] => [
  { path: `${context.id}/bounded-context.md`, content: boundedContextCanvas(context) },
  ...context.aggregates.map((a) => aggregateFile(context, a.id)),
  { path: `${context.id}/event-model-slices.md`, content: eventModelSlices(context) },
];

export const renderModel = (model: DomainModel): OutputFile[] => [
  { path: "context-map.md", content: contextMap(model) },
  ...model.contexts.filter(isModeled).flatMap(contextFiles),
  ...model.flows.map((flow) => ({
    path: `flows/${slug(flow.name)}.md`,
    content: eventModelFlow(model, flow),
  })),
];
