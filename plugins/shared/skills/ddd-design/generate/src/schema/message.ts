import { z } from "zod";
import { dataFields } from "./primitives.ts";

export const command = z.object({
  id: z.string(),
  data: dataFields.optional(),
});

export const event = z.object({
  id: z.string(),
  data: dataFields.optional(),
});
