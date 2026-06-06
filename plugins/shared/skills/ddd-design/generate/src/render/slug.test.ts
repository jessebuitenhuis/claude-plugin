import { describe, expect, it } from "vitest";
import { slug } from "./slug.ts";

describe("slug", () => {
  it.each([
    { input: "Drive an issue from start to done", expected: "drive-an-issue-from-start-to-done" },
    { input: "  Trailing & symbols!  ", expected: "trailing-symbols" },
  ])("slugs '$input'", ({ input, expected }) => {
    expect(slug(input)).toBe(expected);
  });
});
