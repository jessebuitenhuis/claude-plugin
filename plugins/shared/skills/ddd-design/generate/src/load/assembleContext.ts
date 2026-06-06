import { join } from "node:path";
import { asRecord, type UnknownRecord } from "./asRecord.ts";
import { readAggregates } from "./readAggregates.ts";
import { readYaml, readYamlIfPresent } from "./readYaml.ts";

/** Builds one context from its folder: the base file plus its optional sibling sections. */
export const assembleContext = (contextDir: string): UnknownRecord => {
  const contextFile = join(contextDir, "context.yaml");
  const base = asRecord(readYaml(contextFile), contextFile);
  const readModels = readYamlIfPresent(join(contextDir, "read-models.yaml"), {});
  const reactions = readYamlIfPresent(join(contextDir, "reactions.yaml"), {});
  return {
    ...base,
    ...asRecord(readModels, contextDir),
    ...asRecord(reactions, contextDir),
    aggregates: readAggregates(join(contextDir, "aggregates")),
  };
};
