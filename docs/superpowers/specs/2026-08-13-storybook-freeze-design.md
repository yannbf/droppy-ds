# storybook-freeze for Droppy

Port the `storybook-freeze` CLI from
[storybook-tmp/base-ui](https://github.com/storybook-tmp/base-ui/tree/research/packages/storybook-freeze)
into this repo, so Droppy can generate `experiment/*` branches that each contain a selected
subset of the Storybook corpus, and publish each of them to pkg.pr.new.

The upstream package solves the same problem for base-ui's Storybook: content is classified by
facet (story tags, MDX `BEGIN:`/`END:` markers, JSDoc kinds), and one git branch is generated per
experiment holding only the facets that experiment keeps. Agentic reference experiments then
install one branch's package and measure what that content subset is worth.

## Prerequisite

The taxonomy already exists in this repo, but only partly on `main`:

- **On `main`:** the nine repo-wide `src/docs/*.mdx` files carry `<Meta tags={['general-*']} />`.
- **Only on the unmerged `origin/claude/classify-droppy-stories-mdx-q8uivb`:** story `tags`
  (`api-ref`, `animation`, `examples`, `highlight`, `infra`, `showcase`, `tests`) and the
  per-component MDX `{/* BEGIN: <facet> */}` / `{/* END: <facet> */}` markers.

`freeze` builds every branch from whatever `HEAD` is, so it must run from that classification
branch (or after merging it). Run from `main` today and all branches come out identical — there
are no story tags or MDX markers to strip. This design covers the tooling only; landing the
classification is separate work.

## Layout

Per decision, the CLI lives outside the workspace and its dependencies go in the root
`devDependencies`. `pnpm-workspace.yaml` is not touched.

```
tools/storybook-freeze/
  package.json                  private, name @droppy/storybook-freeze, for provenance only
  tsconfig.json                 own noEmit config; root tsconfig does not cover tools/
  vitest.config.ts              node environment
  src/
    cli.ts                      entry point for experiment:freeze
    publish-branches.ts         entry point for experiment:publish-branches
    config.ts                   loads + validates experiments.config.ts
    labels.ts                   loads classification-labels.jsonc
    freeze.ts                   per-branch orchestration
    corpus.ts                   file discovery and per-file dispatch
    story-transform.ts          CSF story stripping            (adapted)
    mdx-transform.ts            MDX facet-block stripping
    source-transform.ts         component/props JSDoc stripping (rewritten)
    canvas-purge.ts             orphaned <Canvas of={...} /> removal
    deadcode.ts                 unreferenced top-level declarations (oxc)
    biome.ts                    unused imports (Biome, single rule)
    format.ts                   Prettier pass
    oxc-utils.ts                parse + leading-block-comment helpers
    git.ts                      simple-git wrappers
    manifest.ts                 experiment.json
    publish-plan.ts             which branches to push
    push-retry.ts               transient-failure retry
    *.test.ts                   15 ported test files
classification-labels.jsonc     repo root
experiments.config.ts           repo root
experiment.json                 written and committed on each frozen branch
.github/workflows/experiment-preview.yml
```

`REPO_ROOT` resolves as `path.resolve(fileURLToPath(import.meta.url), '../../../..')` — the same
literal as upstream, since `tools/storybook-freeze/src/` sits at the same depth as
`packages/storybook-freeze/src/`.

### Root wiring

Four scripts in `package.json`:

```json
"experiment:freeze": "tsx tools/storybook-freeze/src/cli.ts",
"experiment:publish-branches": "tsx tools/storybook-freeze/src/publish-branches.ts",
"experiment:test": "vitest run --config tools/storybook-freeze/vitest.config.ts",
"experiment:check": "tsc --noEmit -p tools/storybook-freeze"
```

Eight new `devDependencies`: `@biomejs/biome`, `@clack/prompts`, `globby`, `jsonc-parser`,
`magic-string`, `oxc-parser`, `simple-git`, `tsx`. `prettier` is already present and is reused.

`experiment:test` needs its own config because the root `vitest.config.ts` is a browser-only
Storybook project; these are node unit tests. `experiment:check` needs its own tsconfig because
the root one is the library build config (`declaration` + `emitDeclarationOnly` into `dist`) and
does not include `tools/`. The tool's tsconfig also includes `../../experiments.config.ts`, which
it imports at runtime.

Two config edits:

- `eslint.config.js` gains a block scoping `tools/**/*.ts` with
  `'@typescript-eslint/no-explicit-any': 'off'`. The AST walkers are inherently untyped —
  `oxc-parser` returns an untyped ESTree program — and upstream relies on the same escape hatch.
- `.github/workflows/ci.yml` gains `pnpm experiment:check` and `pnpm experiment:test` in the
  `verify` job. Tests that never run stop being true; this is the only reason the port has a
  safety net at all, given two modules are rewritten rather than copied.

## Corpus

Globs change from base-ui's monorepo shape to Droppy's single package:

| Content | base-ui                                       | Droppy                                                        |
| ------- | --------------------------------------------- | ------------------------------------------------------------- |
| Stories | `apps/storybook/src/stories/**/*.stories.tsx` | `src/components/*/*.stories.tsx`                              |
| MDX     | `apps/storybook/src/stories/**/*.mdx`         | `src/components/*/*.mdx`, `src/docs/*.mdx`                    |
| Source  | `packages/react/src/**/*.tsx`                 | `src/components/**/*.tsx` minus `*.stories.tsx`, `*.test.tsx` |

`src/utils`, `src/theme` and `src/docs/ComponentBrowser.tsx` stay out of the source corpus: they
hold no component or props documentation.

Verified against the classification branch, so the ported regexes and AST checks hold:

- Component MDX uses `import * as XStories from './X.stories'`, `<Meta of={XStories} />` and
  `<Canvas of={XStories.Y} />` — the namespace-import bookkeeping that drives whole-file deletion
  and `canvas-purge` applies unchanged.
- Repo-wide `src/docs/*.mdx` files carry `<Meta title="…" tags={['general-*']} />` spanning two
  lines. `META_TAGS_RE`'s `[^>]*` matches newlines, so multi-line `<Meta>` is fine.
- `when-to-use` appears **twice** in every component MDX ("When to use" and "Related"). Both are
  removed: after excising a block the loop resets `beginRe.lastIndex` to the cut point and
  re-scans the rewritten string.
- Every component MDX has an `## Anatomy` section whose `<Canvas of={XStories.Anatomy} />` points
  at a story tagged `infra`, which is always stripped. `canvas-purge` drops the orphaned
  `<Canvas>` and keeps the heading, because the anatomy table below it is still content.

## Taxonomy

`classification-labels.jsonc` describes the facets Droppy's classification uses, rather than being
copied from base-ui wholesale:

- `source-jsdoc`: `component`, `props`
- `csf-jsdoc`: `meta`, `story`
- `mdx` (12): `a11y`, `anatomy`, `behavior`, `brand`, `do-dont`, `examples`, `general`,
  `history`, `known-issues`, `props`, `styling`, `when-to-use`
- `general` (6): `general-a11y`, `general-brand`, `general-do-dont`, `general-setup`,
  `general-tokens`, `general-when-to-use`
- `story` (7): `animation`, `api-ref`, `examples`, `highlight`, `infra`, `showcase`, `tests`
- `delete`: `story.infra`

Three deliberate differences from base-ui:

1. **No `story.base`.** That tag marked base-ui's 1:1 copies of base-ui.com doc content and has
   no Droppy equivalent. Nothing replaces it: `BASE_FACETS` carries no story facet at all, so a
   branch that selects no story facets legitimately has no stories.
2. **No `mdx.testing`.** base-ui defines it; Droppy has no testing sections.
3. **`mdx.styling` is a selectable facet, not always-deleted.** base-ui strips it because those
   sections were unwritten stubs. Droppy has 33 real styling sections documenting its own token
   hooks, so it becomes ordinary content and is included in `experiment/full`.

**This work touches no content.** Story tags, MDX markers and `<Meta tags>` are being prepared in
parallel sessions, so the corpus is in flux and nothing here edits `src/`. The taxonomy file
records the facets the tooling understands; whichever annotations exist on the branch being frozen
are what actually get acted on. Two consequences of that, both fine to leave alone:

- An MDX file with no `general-*` tag and no `BEGIN:` markers survives every branch untouched —
  currently `src/docs/ComponentBrowser.mdx`.
- A `BEGIN:` marker naming a facet the taxonomy does not define can never be in `keep`, so it is
  stripped from every branch. Facets added to the content later need a line in
  `classification-labels.jsonc` before they can be selected.

### Consequence of dropping the baseline facet

When every story in a CSF is stripped, `corpus.ts` deletes the file, and then deletes any MDX
that namespace-imports it. So `experiment/empty` (facets `[]`) ends up with no stories _and_ no
component MDX — an empty Storybook that `build-storybook` would refuse to build. That is
acceptable: it is the control branch, and the publishing workflow builds the package, not
Storybook. Worth knowing before anyone points Chromatic at an experiment branch.

## experiments.config.ts

Ports base-ui's entries with `story.base` removed from `BASE_FACETS` and `mdx.styling` added to
the full branch. `BASE_FACETS` is `source-jsdoc.component`, `source-jsdoc.props`,
`csf-jsdoc.meta`, `csf-jsdoc.story`, `mdx.anatomy`, `general.general-setup`,
`general.general-brand`.

Seventeen branches: `empty`, `base`, `full`, `basic-docs`, `do-dont`, `when-to-use`,
`history-issues`, `a11y`, `brand-animation`, `api-ref`, `docs-full`, `stories-api-ref`,
`stories-showcase`, `stories-highlight`, `stories-examples`, `stories-full`, `purge-jsdoc`.

That is upstream's 16 live entries plus `stories-showcase`, which upstream had commented out for
want of a single showcase story — Droppy has 33, one per component, so it becomes a live entry.
Upstream's other commented-out entry, `product-examples`, is dropped rather than carried over as
dead configuration.

Validation is unchanged: every `branchName` must start with `experiment/`, names must be unique,
and every facet must be a qualified `category.leaf` that is defined and not in `delete`.

## Port matrix

Copied essentially verbatim, with module docstrings and error-message prefixes re-pointed from
"Base UI" to "Droppy", and rewritten in this repo's Prettier style (no semicolons, single quotes,
100 columns):

`config.ts`, `labels.ts`, `manifest.ts`, `git.ts`, `publish-plan.ts`, `push-retry.ts`,
`freeze.ts`, `corpus.ts` (globs only), `mdx-transform.ts`, `canvas-purge.ts`, `deadcode.ts`,
`biome.ts`, `format.ts`, `oxc-utils.ts`, `cli.ts` (labels path only),
`publish-branches.ts` (outro text only).

Upstream's `/* eslint-disable no-await-in-loop */` pragmas are dropped — that rule is not enabled
here, and an inert disable directive is just noise. The prose comments explaining _why_ the loops
are sequential stay.

### source-transform.ts — rewritten

base-ui keys component JSDoc off `export namespace X` declarations and props JSDoc off
`export interface XProps`. Droppy has neither. Its components read:

```tsx
type DefaultProps = {
  /** The label. Rendered capitalized regardless of the casing passed in. */
  text: string
  className?: string
}

export type BadgeProps = DefaultProps & Omit<ComponentProps<'span'>, keyof DefaultProps>

/** An indeterminate loading indicator — three dots crossing an arc. */
export const Badge = ({ text, className, ...rest }: BadgeProps) => (…)
```

New rules:

- `source-jsdoc.component` — strip the leading block comment of every top-level
  `ExportNamedDeclaration` whose declaration is a `VariableDeclaration` or `FunctionDeclaration`.
- `source-jsdoc.props` — for every top-level `TSTypeAliasDeclaration` or `TSInterfaceDeclaration`
  whose name ends in `Props`, strip the leading block comment of each member. Type aliases need
  recursion into `TSTypeLiteral`s nested inside `TSIntersectionType`, since the documented members
  can sit in either operand.

The `Props` name filter is upstream's heuristic and it fits: it catches `DefaultProps` (14 files),
`ElementProps` and every `export type XProps`, while leaving mock-data types like `Order`,
`MenuRow` and `BodySize` documented.

The early return when both facets are kept is preserved, so a branch keeping all JSDoc does not
reparse the source tree.

### story-transform.ts — one fix

Droppy writes `const meta = { … } satisfies Meta<typeof X>`, so the declarator's `init` is a
`TSSatisfiesExpression`. Upstream's `tagsOf` checks for `ObjectExpression` and silently returns
`[]`, losing meta-level tags — which currently means a story would be judged on its own tags
alone. Unwrap `TSSatisfiesExpression` and `TSAsExpression` before reading `tags`.

Everything else works as-is: `export const Default: Story = { tags: ['showcase'] }` matches the
`Story` / `StoryObj` type-annotation check, and `const meta = …` matches the meta lookup.

## Dead code and formatting

Unchanged two-stage cleanup, and both stages stay scoped to this tool:

1. `deadcode.ts` (oxc) removes non-exported top-level functions and variables left unreferenced
   after stories are stripped, iterating to a fixpoint so a helper used only by another removed
   helper also goes. Reference counting is liberal, so the bias is to keep.
2. `biome.ts` shells out to `biome lint --write --unsafe --only=correctness/noUnusedImports` on
   the written story files. No `biome.json`, no repo-wide Biome adoption, no interaction with
   ESLint or Prettier — the single-rule scope is what makes that safe.

Then `format.ts` runs Prettier over the written files, picking up `.prettierrc` and
`.prettierignore` on its own. Order matters and is preserved: strip, purge dead code, drop
imports, format, write `experiment.json`, commit.

## Publishing

`publish-branches.ts` ports as-is. It plans from `experiments.config.ts` against local and remote
refs, reporting four buckets — `push`, `upToDate`, `missing`, `stray` — then force-pushes
sequentially with exponential backoff on transient failures, verifying after each error whether
the ref landed anyway (a push can succeed server-side and still report a broken connection).
`--yes`, `--force` and `--attempts` are kept. Re-running after a partial failure only pushes what
is missing.

Frozen branches rewrite history every time, so force-pushing is the point, not a hazard: remote
`experiment/*` refs are disposable build artifacts.

### experiment-preview.yml

New workflow, on `push: branches: ['experiment/**']` plus `workflow_dispatch`. Droppy has no MCP
server package, so it publishes the one package this repo has. The stripped source JSDoc lands in
`dist/index.d.ts`, so the branches genuinely differ in what a consumer installs.

It follows the conventions of the existing `preview-release.yml` — unpinned `@v4` actions,
`pnpm install --frozen-lockfile`, `pnpm build` — rather than base-ui's SHA-pinned style, so the
two workflows stay consistent with each other. Then:

```
pnpx pkg-pr-new publish --compact --pnpm --comment=off
```

`--comment=off` because an experiment branch push has no PR to comment on. A
`$GITHUB_STEP_SUMMARY` block records the install URLs, mirroring upstream's:

```
https://pkg.pr.new/yannbf/droppy-ds/@droppy/design-system@<sha>
https://pkg.pr.new/yannbf/droppy-ds/@droppy/design-system@experiment/<name>
```

`preview-release.yml` is left alone and keeps serving `main` and pull requests.

## Testing

All 15 upstream test files port over, adjusted for the two rewritten modules — `source-transform`
tests are replaced with cases built from Droppy's actual component shapes (`DefaultProps` members,
intersection operands, JSDoc'd `export const`), and `story-transform` gains a case asserting that
meta tags are read through a `satisfies` expression.

They are node-environment unit tests over string in, string out transforms, so they need no
fixtures on disk beyond inline source snippets. `git.ts`, `publish-plan.ts` and `push-retry.ts`
keep their upstream tests; `push-retry` injects `sleep` so no test waits.

Beyond the unit tests, the port is verified by running `pnpm experiment:freeze` from the
classification branch and inspecting a generated branch — that a doc-only branch keeps its MDX and
loses its stories, that `experiment/full` still type-checks and builds, and that no frozen branch
carries dangling imports.

## Out of scope

- Landing the story tags and MDX markers on `main`.
- Any MCP server package. base-ui's `storybook-mcp-preview.yml` publishes one; Droppy has no
  equivalent and this port does not invent one.
- Chromatic or Storybook builds per experiment branch.
- Actually running the branch-generation and pushing to origin. The tooling is the deliverable;
  the first real freeze is a separate, deliberate act.
