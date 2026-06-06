import type { Context } from "../schema/context.ts";

export const isModeled = (context: Context): boolean =>
  context.aggregates.length > 0;
