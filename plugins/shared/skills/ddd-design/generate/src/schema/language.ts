import { z } from "zod";
import { actorKind } from "./primitives.ts";

export const languageTerm = z.object({
  term: z.string(),
  kind: z.string(),
  definition: z.string(),
});

export const actor = z.object({
  id: z.string(),
  kind: actorKind,
  definition: z.string(),
});
