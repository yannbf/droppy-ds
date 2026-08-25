# storybook-freeze

Generates the `experiment/*` branches. Each branch holds one subset of the Storybook corpus,
for measuring what a given kind of documentation is worth to an agent.

```bash
pnpm experiment:freeze             # regenerate every branch in experiments.config.ts
pnpm experiment:publish-branches   # force-push them to origin
```

Facets are the qualified `category.leaf` labels in `classification-labels.jsonc`; each branch's
selection lives in `experiments.config.ts` and is recorded in the `experiment.json` the freeze
commits. Freezing reads the classification on the branch you run it from — story `tags`, MDX
`{/* BEGIN: facet */}` markers, and the `<Meta tags>` on the repo-wide docs.

Each pushed branch triggers the Storybook MCP preview workflow, which publishes that branch's
Storybook manifests as an installable `@droppy/mcp` server on pkg.pr.new:

```
https://pkg.pr.new/yannbf/droppy-ds/@droppy/mcp@experiment/<name>
```

Serving that package is what makes a branch's facet selection observable: the library build is
the same on every branch, so the documentation only differs through the MCP. See
[apps/mcp-server](../../apps/mcp-server/README.md) for how to run one.

## Checks

```bash
pnpm experiment:check   # types
pnpm experiment:test    # unit tests
```
