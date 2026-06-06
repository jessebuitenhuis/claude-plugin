import { z } from "zod";
import { stateCategory } from "./primitives.ts";

export const state = z.object({
  id: z.string(),
  name: z.string(),
  category: stateCategory,
});
