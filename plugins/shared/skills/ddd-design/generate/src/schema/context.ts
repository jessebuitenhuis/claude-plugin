import { z } from "zod";
import { aggregate } from "./aggregate.ts";
import { actor, languageTerm } from "./language.ts";
import { classification } from "./classification.ts";
import { reaction } from "./reaction.ts";
import { readModel } from "./readModel.ts";

/** A stub context declares only identity and classification; a modeled one adds the tactical detail. */
export const context = z.object({
  id: z.string(),
  name: z.string(),
  classification,
  purpose: z.string().optional(),
  roles: z.array(z.string()).default([]),
  language: z.array(languageTerm).default([]),
  actors: z.array(actor).default([]),
  aggregates: z.array(aggregate).default([]),
  readModels: z.array(readModel).default([]),
  reactions: z.array(reaction).default([]),
});

export type Context = z.infer<typeof context>;
