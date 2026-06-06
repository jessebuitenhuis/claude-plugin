import { describe, expect, it } from "vitest";
import { aggregate } from "../schema/aggregate.ts";
import { checkAggregate } from "./checkAggregate.ts";

const build = (overrides: Record<string, unknown>) =>
  aggregate.parse({
    id: "issue",
    name: "Issue",
    description: "an issue",
    initial: "open",
    states: [{ id: "open", name: "Open" }],
    commands: [{ id: "Close" }],
    events: [{ id: "Closed" }],
    ...overrides,
  });

const messages = (aggregateOverrides: Record<string, unknown>) =>
  checkAggregate("ctx", build(aggregateOverrides)).map((issue) => issue.message);

describe("checkAggregate", () => {
  it("passes a consistent aggregate", () => {
    expect(checkAggregate("ctx", build({}))).toEqual([]);
  });

  it.each([
    {
      name: "undeclared initial state",
      overrides: { initial: "ghost" },
      expected: "initial state 'ghost' not declared",
    },
    {
      name: "transition to an unknown state",
      overrides: {
        transitions: [{ from: "open", command: "Close", produces: ["Closed"], to: "ghost" }],
      },
      expected: "transition to 'ghost' not a declared state",
    },
    {
      name: "transition producing an unknown event",
      overrides: {
        transitions: [{ from: "open", command: "Close", produces: ["Vanished"], to: "open" }],
      },
      expected: "transition produces unknown event 'Vanished'",
    },
    {
      name: "example referencing an undeclared command",
      overrides: {
        examples: [{ name: "e", given: "g", when: "Ghost", then: ["Closed"] }],
      },
      expected: "example 'e' when 'Ghost' not a declared command",
    },
  ])("flags $name", ({ overrides, expected }) => {
    expect(messages(overrides)).toContain(expected);
  });
});
