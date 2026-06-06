import { describe, expect, it } from "vitest";
import { resolvePath } from "./resolvePath.ts";

const model = {
  contexts: [
    {
      id: "work_item_management",
      classification: { domain: "core" },
      aggregates: [{ id: "issue" }],
    },
  ],
  flows: [{ name: "Drive it", steps: [{ reaction: "rx" }] }],
};

describe("resolvePath", () => {
  it.each([
    {
      name: "context index resolves to its id",
      path: ["contexts", 0, "classification", "domain"],
      expected: "contexts[work_item_management].classification.domain",
    },
    {
      name: "nested aggregate index resolves to its id",
      path: ["contexts", 0, "aggregates", 0, "id"],
      expected: "contexts[work_item_management].aggregates[issue].id",
    },
    {
      name: "flow resolves by name, unnamed step keeps its index",
      path: ["flows", 0, "steps", 0],
      expected: "flows[Drive it].steps[0]",
    },
    {
      name: "index with no id/name falls back to the number",
      path: ["relationships", 2, "upstream"],
      expected: "relationships[2].upstream",
    },
  ])("$name", ({ path, expected }) => {
    expect(resolvePath(model, path)).toBe(expected);
  });
});
