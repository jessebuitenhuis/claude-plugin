import { z } from "zod";

export const readModel = z.object({
  id: z.string(),
  description: z.string(),
  folds: z.array(z.string()),
});
