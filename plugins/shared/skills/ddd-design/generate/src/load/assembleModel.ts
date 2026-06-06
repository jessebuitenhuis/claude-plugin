import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { asRecord, type UnknownRecord } from "./asRecord.ts";
import { assembleContext } from "./assembleContext.ts";
import { readYamlIfPresent } from "./readYaml.ts";

const readContexts = (contextsDir: string): UnknownRecord[] => {
  if (!existsSync(contextsDir)) return [];
  return readdirSync(contextsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => assembleContext(join(contextsDir, entry.name)));
};

/** Walks the model directory into the single raw object the schema then validates. */
export const assembleModel = (modelDir: string): UnknownRecord => {
  const relationships = readYamlIfPresent(join(modelDir, "relationships.yaml"), {});
  const flows = readYamlIfPresent(join(modelDir, "flows.yaml"), {});
  return {
    ...asRecord(relationships, modelDir),
    ...asRecord(flows, modelDir),
    contexts: readContexts(join(modelDir, "contexts")),
  };
};
