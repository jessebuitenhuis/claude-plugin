export const code = (value: string): string => `\`${value}\``;

export const codeList = (values: readonly string[], empty = "—"): string =>
  values.length ? values.map(code).join(", ") : empty;
