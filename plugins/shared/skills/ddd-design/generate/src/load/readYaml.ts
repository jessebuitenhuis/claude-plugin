import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";

export const readYaml = (path: string): unknown => {
  try {
    return parse(readFileSync(path, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`cannot read ${path}: ${reason}`);
  }
};

/** Reads a file that may be absent (optional context sections), defaulting when it is. */
export const readYamlIfPresent = (path: string, fallback: unknown): unknown =>
  existsSync(path) ? readYaml(path) : fallback;
