import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadModel } from "./load/loadModel.ts";
import { renderModel, type OutputFile } from "./render/renderModel.ts";

const USAGE = `Usage: ddd-generate [model-dir] [out-dir]

Projects DDD canvases from the domain model directory. The model is validated
first; on any error nothing is written.

Defaults: model-dir=model, out-dir=generated`;

const requireModelDir = (path: string): void => {
  if (!existsSync(path) || !statSync(path).isDirectory())
    throw new Error(`model directory not found: ${path}`);
};

const writeOutputs = (outDir: string, files: readonly OutputFile[]): void => {
  for (const file of files) {
    const target = join(outDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${file.content}\n`);
  }
};

const formatError = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const run = (modelDir: string, outDir: string): void => {
  requireModelDir(modelDir);
  const files = renderModel(loadModel(modelDir));
  writeOutputs(outDir, files);
  console.log(`generated ${files.length} canvas file(s) into ${outDir}/`);
};

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) {
  console.log(USAGE);
  process.exit(0);
}

const [modelDir = "model", outDir = "generated"] = args;
try {
  run(modelDir, outDir);
} catch (error) {
  console.error(formatError(error));
  process.exit(1);
}
