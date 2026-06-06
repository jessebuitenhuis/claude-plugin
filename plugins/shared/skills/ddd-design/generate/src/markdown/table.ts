type Row = readonly string[];

const toRow = (cells: Row): string => `| ${cells.join(" | ")} |`;

const divider = (columns: number): string =>
  toRow(Array.from({ length: columns }, () => "---"));

/** Renders a GitHub-flavored markdown table, falling back to a single empty row. */
export const table = (
  headers: Row,
  rows: readonly Row[],
  emptyRow?: Row,
): string => {
  const body = rows.length ? rows : [emptyRow ?? headers.map(() => "—")];
  return [toRow(headers), divider(headers.length), ...body.map(toRow)].join(
    "\n",
  );
};
