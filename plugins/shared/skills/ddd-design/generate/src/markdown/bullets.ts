export const bullets = (items: readonly string[], empty = "_none_"): string =>
  items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${empty}`;
