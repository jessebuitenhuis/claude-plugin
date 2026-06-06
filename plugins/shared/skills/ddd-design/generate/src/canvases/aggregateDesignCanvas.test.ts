import { describe, expect, it } from "vitest";
import { aggregate } from "../schema/aggregate.ts";
import { aggregateDesignCanvas } from "./aggregateDesignCanvas.ts";

const withCommands = (commandIds: string[]) =>
  aggregate.parse({
    id: "issue",
    name: "Issue",
    description: "an issue",
    initial: "open",
    states: [{ id: "open", name: "Open", category: "started" }],
    commands: commandIds.map((id) => ({ id })),
    events: [{ id: "Closed" }],
    transitions: [{ from: "open", command: "CloseIssue", produces: ["Closed"], to: "open" }],
  });

describe("aggregateDesignCanvas", () => {
  it("renders a transition row with state names", () => {
    const canvas = aggregateDesignCanvas(withCommands(["CloseIssue"]));
    expect(canvas).toContain("| Open | `CloseIssue` |");
    expect(canvas).toContain("`Closed`");
  });

  it.each([
    { commands: ["CreateIssue", "CloseIssue"], expected: "creation command present" },
    { commands: ["CloseIssue"], expected: "no `Create*` command" },
  ])("reports lifecycle check: $expected", ({ commands, expected }) => {
    expect(aggregateDesignCanvas(withCommands(commands))).toContain(expected);
  });
});
