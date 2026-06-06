import { describe, expect, it } from "vitest";
import { domainModel } from "../schema/domainModel.ts";
import { checkIntegrity } from "./checkIntegrity.ts";

const aggregate = (overrides: Record<string, unknown> = {}) => ({
  id: "agg",
  name: "Agg",
  description: "d",
  initial: "open",
  states: [{ id: "open", name: "Open" }],
  commands: [{ id: "Close" }],
  events: [{ id: "Closed" }],
  transitions: [{ from: "open", command: "Close", produces: ["Closed"], to: "open" }],
  ...overrides,
});

const context = (overrides: Record<string, unknown> = {}) => ({
  id: "ctx",
  name: "Ctx",
  classification: { domain: "core", businessModel: "x", evolution: "product" },
  aggregates: [aggregate()],
  ...overrides,
});

const messagesFor = (raw: Record<string, unknown>): string[] =>
  checkIntegrity(domainModel.parse(raw)).map((issue) => issue.message);

describe("checkIntegrity", () => {
  it("passes a consistent single-context model", () => {
    expect(messagesFor({ contexts: [context()] })).toEqual([]);
  });

  it("flags duplicate ids that a Set would silently collapse", () => {
    const dup = aggregate({
      states: [
        { id: "open", name: "Open" },
        { id: "open", name: "Open again" },
      ],
    });
    expect(messagesFor({ contexts: [context({ aggregates: [dup] })] })).toContain(
      "duplicate state id 'open'",
    );
  });

  it.each([
    {
      name: "read model folding an unknown event",
      ctx: { readModels: [{ id: "RM", description: "d", folds: ["Ghost"] }] },
      expected: "read model 'RM' folds unknown event 'Ghost'",
    },
    {
      name: "reaction on an unknown event",
      ctx: { reactions: [{ id: "rx", whenEvent: "Ghost", thenCommand: "Do", inContext: "ctx" }] },
      expected: "reaction 'rx' whenEvent 'Ghost' unknown",
    },
    {
      name: "reaction targeting an unknown context",
      ctx: { reactions: [{ id: "rx", whenEvent: "Closed", thenCommand: "Do", inContext: "nope" }] },
      expected: "reaction 'rx' inContext 'nope' unknown",
    },
  ])("flags a $name", ({ ctx, expected }) => {
    expect(messagesFor({ contexts: [context(ctx)] })).toContain(expected);
  });

  it("flags a relationship endpoint that is not a known context", () => {
    const raw = {
      contexts: [context()],
      relationships: [{ upstream: "ctx", downstream: "nope", pattern: "P", integration: "i" }],
    };
    expect(messagesFor(raw)).toContain("downstream 'nope' unknown");
  });

  it.each([
    {
      name: "transition",
      steps: [{ transition: { command: "Ghost", from: "open" } }],
      expected: "missing transition Ghost@open",
    },
    {
      name: "reaction",
      steps: [{ reaction: "nope" }],
      expected: "missing reaction 'nope'",
    },
  ])("flags a flow step referencing a $name that does not exist", ({ steps, expected }) => {
    const raw = { contexts: [context()], flows: [{ name: "F", trigger: "t", steps }] };
    expect(messagesFor(raw)).toContain(expected);
  });

  it("accepts a flow step that resolves through a wildcard transition", () => {
    const wildcard = aggregate({
      transitions: [{ from: "*", command: "Close", produces: ["Closed"], to: "open" }],
    });
    const raw = {
      contexts: [context({ aggregates: [wildcard] })],
      flows: [{ name: "F", trigger: "t", steps: [{ transition: { command: "Close", from: "open" } }] }],
    };
    expect(messagesFor(raw)).toEqual([]);
  });
});
