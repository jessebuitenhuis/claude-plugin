import { loadModel } from "./load/loadModel.ts";
import { renderModel } from "./render/renderModel.ts";
import type { OutputFile } from "./render/outputFile.ts";

/** Loads and validates the model directory, then projects every canvas in memory. */
export const generate = (modelDir: string): OutputFile[] =>
  renderModel(loadModel(modelDir));
