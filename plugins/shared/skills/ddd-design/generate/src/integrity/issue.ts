export interface IntegrityIssue {
  readonly where: string;
  readonly message: string;
}

export const issue = (where: string, message: string): IntegrityIssue => ({
  where,
  message,
});

export const formatIssues = (issues: readonly IntegrityIssue[]): string =>
  issues.map(({ where, message }) => `  - [${where}] ${message}`).join("\n");
