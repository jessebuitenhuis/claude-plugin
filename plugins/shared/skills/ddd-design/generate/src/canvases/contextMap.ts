import type { DomainModel } from "../schema/domainModel.ts";
import { bullets } from "../markdown/bullets.ts";
import { table } from "../markdown/table.ts";

const contextName = (model: DomainModel, id: string): string =>
  model.contexts.find((context) => context.id === id)?.name ?? id;

const contextLine = (model: DomainModel, id: string): string => {
  const context = model.contexts.find((c) => c.id === id);
  if (!context) return id;
  const stub = context.aggregates.length ? "" : " _(stub — not yet modeled)_";
  return `**${context.name}** — ${context.classification.domain}${stub}`;
};

export const contextMap = (model: DomainModel): string => {
  const contexts = model.contexts.map((c) => contextLine(model, c.id));
  const rows = model.relationships.map((r) => [
    contextName(model, r.upstream),
    contextName(model, r.downstream),
    r.pattern,
    r.integration,
  ]);
  return `## Context Map

### Contexts
${bullets(contexts)}

### Relationships
${table(["Upstream", "Downstream", "Pattern", "Integration"], rows)}`;
};
