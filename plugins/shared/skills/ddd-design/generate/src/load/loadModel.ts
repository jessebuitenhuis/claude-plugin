import { checkIntegrity } from "../integrity/checkIntegrity.ts";
import { domainModel, type DomainModel } from "../schema/domainModel.ts";
import { assembleModel } from "./assembleModel.ts";
import { ModelError } from "./modelError.ts";
import { SchemaError } from "./schemaError.ts";

/** Assembles the model directory, validates shape (Zod) then references (integrity). */
export const loadModel = (modelDir: string): DomainModel => {
  const raw = assembleModel(modelDir);
  const result = domainModel.safeParse(raw);
  if (!result.success) throw new SchemaError(raw, result.error);
  const model = result.data;
  if (model.contexts.length === 0)
    throw new Error(`no contexts found under ${modelDir}/contexts`);
  const issues = checkIntegrity(model);
  if (issues.length) throw new ModelError(issues);
  return model;
};
