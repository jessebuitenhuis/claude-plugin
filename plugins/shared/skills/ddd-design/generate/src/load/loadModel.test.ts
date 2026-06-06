import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderModel } from "../render/renderModel.ts";
import { loadModel } from "./loadModel.ts";

const exampleModel = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../example/model",
);

describe("loadModel (example model)", () => {
  const model = loadModel(exampleModel);

  it("assembles every context, including stubs", () => {
    expect(model.contexts.map((context) => context.id).sort()).toEqual([
      "collaboration",
      "identity_access",
      "insights",
      "planning",
      "work_item_management",
      "workflow_configuration",
    ]);
  });

  it("merges sibling sections into the modeled context", () => {
    const wim = model.contexts.find((c) => c.id === "work_item_management");
    expect(wim?.aggregates).toHaveLength(1);
    expect(wim?.readModels).toHaveLength(3);
    expect(wim?.reactions).toHaveLength(2);
  });

  it("projects one file per canvas and none for stub contexts", () => {
    const paths = renderModel(model).map((file) => file.path);
    expect(paths).toContain("context-map.md");
    expect(paths).toContain("work_item_management/issue.aggregate.md");
    expect(paths).toContain("flows/drive-an-issue-from-start-to-done.md");
    expect(paths.some((path) => path.startsWith("planning/"))).toBe(false);
  });
});
