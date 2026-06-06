import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";

export const readYaml = (path: string): unknown =>
  parse(readFileSync(path, "utf8"));

/** Reads a file that may be absent (optional context sections), defaulting when it is. */
export const readYamlIfPresent = <T>(path: string, fallback: T): T | unknown =>
  existsSync(path) ? readYaml(path) : fallback;
