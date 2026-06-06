import { checkIntegrity } from "../integrity/checkIntegrity.ts";
import { domainModel, type DomainModel } from "../schema/domainModel.ts";
import { assembleModel } from "./assembleModel.ts";
import { ModelError } from "./modelError.ts";

/** Assembles the model directory, validates shape (Zod) then references (integrity). */
export const loadModel = (modelDir: string): DomainModel => {
  const model = domainModel.parse(assembleModel(modelDir));
  if (model.contexts.length === 0)
    throw new Error(`no contexts found under ${modelDir}/contexts`);
  const issues = checkIntegrity(model);
  if (issues.length) throw new ModelError(issues);
  return model;
};
