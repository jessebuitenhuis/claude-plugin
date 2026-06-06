export type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const asRecord = (value: unknown, path: string): UnknownRecord => {
  if (!isRecord(value)) throw new Error(`expected a mapping in ${path}`);
  return value;
};
