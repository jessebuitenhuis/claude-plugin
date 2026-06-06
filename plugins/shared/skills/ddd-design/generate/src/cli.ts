import { generate } from "./generate.ts";
import { formatError } from "./cli/formatError.ts";
import { writeOutputs } from "./cli/writeOutputs.ts";

const [modelDir = "model", outDir = "generated"] = process.argv.slice(2);

const run = (): void => {
  const files = generate(modelDir);
  writeOutputs(outDir, files);
  console.error(`generated ${files.length} canvas file(s) into ${outDir}/`);
};

try {
  run();
} catch (error) {
  console.error(formatError(error));
  process.exit(1);
}
