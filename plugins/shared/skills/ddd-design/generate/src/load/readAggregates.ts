import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readYaml } from "./readYaml.ts";

const isYaml = (name: string): boolean =>
  name.endsWith(".yaml") || name.endsWith(".yml");

export const readAggregates = (aggregatesDir: string): unknown[] => {
  if (!existsSync(aggregatesDir)) return [];
  return readdirSync(aggregatesDir)
    .filter(isYaml)
    .sort()
    .map((name) => readYaml(join(aggregatesDir, name)));
};
