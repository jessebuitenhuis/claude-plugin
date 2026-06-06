import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readYaml } from "./readYaml.ts";

const isYaml = (name: string): boolean =>
  name.endsWith(".yaml") || name.endsWith(".yml");

export const readAggregates = (aggregatesDir: string): unknown[] => {
  if (!existsSync(aggregatesDir)) return [];
  return readdirSync(aggregatesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isYaml(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => readYaml(join(aggregatesDir, entry.name)));
};
