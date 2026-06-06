import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { OutputFile } from "../render/outputFile.ts";

export const writeOutputs = (outDir: string, files: readonly OutputFile[]): void => {
  for (const file of files) {
    const target = join(outDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${file.content}\n`);
  }
};
