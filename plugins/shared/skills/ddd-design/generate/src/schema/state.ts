import { z } from "zod";

export const state = z.object({
  id: z.string(),
  name: z.string(),
});
