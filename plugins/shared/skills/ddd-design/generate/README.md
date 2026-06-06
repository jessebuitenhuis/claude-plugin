# Canvas generator

Projects the DDD canvases from the domain model. The model is the single source
of truth; every canvas is a generated, read-only view of it. Never hand-edit a
generated canvas — edit the model and regenerate.

## Run

```bash
npm install                      # first time only
npm run generate -- <model-dir> <out-dir>
```

Both arguments are optional and default to `model` and `generated`. To project
the worked example:

```bash
npm run generate -- example/model generated
```

The command validates the model before writing anything:

- **shape and vocabulary** via the Zod schema (`src/schema`)
- **cross-references** via the integrity checks (`src/integrity`) — every event,
  state, guard, command, context and flow step must resolve

On any failure it prints the offending locations and writes nothing.

## Model layout

A stub context is one file; a modeled context is a folder; an aggregate is
always its own file. The loader merges the directory into one model, then
validates the whole.

```
model/
  relationships.yaml             # context-map edges
  flows.yaml                     # cross-context event-model timelines
  contexts/
    <context-id>/
      context.yaml               # identity, classification, language, actors
      read-models.yaml           # optional
      reactions.yaml             # optional
      aggregates/
        <aggregate-id>.yaml      # one aggregate per file
```

## Output layout

```
generated/
  context-map.md
  <context-id>/
    bounded-context.md
    <aggregate-id>.aggregate.md  # aggregate design canvas + example map
    event-model-slices.md
  flows/
    <flow-name>.md
```

## Develop

```bash
npm test          # vitest, co-located *.test.ts
npm run typecheck # tsc --noEmit
```
