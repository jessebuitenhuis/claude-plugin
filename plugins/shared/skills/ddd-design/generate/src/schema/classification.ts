import { z } from "zod";
import { domainImportance, evolution } from "./primitives.ts";

export const classification = z.object({
  domain: domainImportance,
  businessModel: z.string(),
  evolution,
});
