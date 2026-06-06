import type { z } from "zod";
import type { Aggregate } from "../schema/aggregate.ts";
import type { example } from "../schema/aggregate.ts";
import { looksLikeEvent } from "../projections/looksLikeEvent.ts";
import { code } from "../markdown/code.ts";

type Example = z.infer<typeof example>;
type Rule = { id: string; statement: string };

const rulesOf = (aggregate: Aggregate): Rule[] => [
  ...aggregate.invariants,
  ...aggregate.guards,
];

const ruleBlock = (rule: Rule, examples: Example[]): string => {
  const tied = examples.filter((e) => e.rule === rule.id).map((e) => `  - _${e.name}_`);
  const lines = tied.length ? tied : ["  - _(no example yet)_"];
  return [`- **${rule.id}** — ${rule.statement}`, ...lines].join("\n");
};

const coverage = (label: string, ids: string[]): string => {
  const covered = ids.length ? ids.map(code).join(", ") : "_none — all covered_";
  return `- ${label}: ${covered}`;
};

const renderThen = (entry: string): string =>
  looksLikeEvent(entry) ? `${code(entry)} recorded` : entry;

const scenario = (example: Example): string => {
  const [first, ...rest] = example.then;
  return [
    `  Scenario: ${example.name}`,
    `    Given ${example.given}`,
    `    When ${example.when} is issued`,
    `    Then ${renderThen(first ?? "")}`,
    ...rest.map((entry) => `    And ${renderThen(entry)}`),
  ].join("\n");
};

const commandsWithoutExample = (aggregate: Aggregate, examples: Example[]): string[] => {
  const covered = new Set(examples.map((e) => e.when));
  return aggregate.commands.map((c) => c.id).filter((id) => !covered.has(id));
};

const rulesWithoutExample = (rules: Rule[], examples: Example[]): string[] =>
  rules.filter((rule) => !examples.some((e) => e.rule === rule.id)).map((r) => r.id);

export const exampleMap = (aggregate: Aggregate): string => {
  const examples = aggregate.examples;
  const rules = rulesOf(aggregate);
  const blocks = rules.map((rule) => ruleBlock(rule, examples));
  const unlinked = examples.filter((e) => !e.rule).map((e) => `- _${e.name}_`);

  return `## Example Map + Gherkin — ${aggregate.name}

### Rules and their examples
${blocks.join("\n")}
${unlinked.length ? `\n**Not tied to a rule:**\n${unlinked.join("\n")}\n` : ""}
### Coverage
${coverage("Commands without an example", commandsWithoutExample(aggregate, examples))}
${coverage("Rules without an example", rulesWithoutExample(rules, examples))}

\`\`\`gherkin
Feature: ${aggregate.name} lifecycle

${examples.map(scenario).join("\n\n")}
\`\`\``;
};
