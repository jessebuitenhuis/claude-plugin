import { z } from "zod";
import { actorKind, domainImportance, evolution } from "./primitives.ts";
import { aggregate } from "./aggregate.ts";

export const classification = z.object({
  domain: domainImportance,
  businessModel: z.string(),
  evolution,
});

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

export const readModel = z.object({
  id: z.string(),
  description: z.string(),
  folds: z.array(z.string()),
});

/** Stateless cross-context listener: one event drives one command elsewhere. */
export const reaction = z.object({
  id: z.string(),
  whenEvent: z.string(),
  condition: z.string().optional(),
  thenCommand: z.string(),
  inContext: z.string(),
});

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
