type Key = string | number;

const index = (value: unknown, key: Key): unknown => {
  if (Array.isArray(value) && typeof key === "number") return value[key];
  if (value && typeof value === "object")
    return (value as Record<string, unknown>)[String(key)];
  return undefined;
};

const labelFor = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const named = value as { id?: unknown; name?: unknown };
  const label = named.id ?? named.name;
  return typeof label === "string" ? label : undefined;
};

/**
 * Turns a Zod issue path into a readable location, replacing array indices with
 * the indexed element's `id`/`name` where available:
 * `["contexts", 0, "classification"]` -> `contexts[work_item_management].classification`.
 */
export const resolvePath = (
  root: unknown,
  path: ReadonlyArray<Key>,
): string => {
  const segments: string[] = [];
  let current = root;
  for (const key of path) {
    current = index(current, key);
    if (typeof key === "number") {
      const label = labelFor(current);
      segments.push(`[${label ?? key}]`);
      continue;
    }
    segments.push(segments.length ? `.${key}` : key);
  }
  return segments.join("");
};
