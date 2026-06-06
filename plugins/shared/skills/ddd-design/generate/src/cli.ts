import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ZodError } from "zod";
import { loadModel } from "./load/loadModel.ts";
import { ModelError } from "./load/modelError.ts";
import { renderModel, type OutputFile } from "./render/renderModel.ts";

const [modelDir = "model", outDir = "generated"] = process.argv.slice(2);

const requireModelDir = (path: string): void => {
  if (!existsSync(path) || !statSync(path).isDirectory())
    throw new Error(`model directory not found: ${path}`);
};

const writeOutputs = (files: readonly OutputFile[]): void => {
  for (const file of files) {
    const target = join(outDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${file.content}\n`);
  }
};

const formatZod = (error: ZodError): string => {
  const lines = error.issues.map(
    (issue) => `  - [${issue.path.join(".") || "(root)"}] ${issue.message}`,
  );
  return `model does not match schema:\n${lines.join("\n")}`;
};

const formatError = (error: unknown): string => {
  if (error instanceof ModelError) return error.message;
  if (error instanceof ZodError) return formatZod(error);
  return error instanceof Error ? error.message : String(error);
};

const run = (): void => {
  requireModelDir(modelDir);
  const files = renderModel(loadModel(modelDir));
  writeOutputs(files);
  console.log(`generated ${files.length} canvas file(s) into ${outDir}/`);
};

try {
  run();
} catch (error) {
  console.error(formatError(error));
  process.exit(1);
}
