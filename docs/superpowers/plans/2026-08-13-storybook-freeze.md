# storybook-freeze Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port base-ui's `storybook-freeze` CLI into Droppy so `pnpm experiment:freeze` generates one `experiment/*` branch per facet selection, `pnpm experiment:publish-branches` force-pushes them, and a CI workflow publishes each to pkg.pr.new.

**Architecture:** A node CLI in `tools/storybook-freeze/`, run through `tsx`, with dependencies in the root `devDependencies`. Two entry points (`cli.ts`, `publish-branches.ts`) over a set of single-responsibility modules: a taxonomy loader, a config validator, four content transforms, two cleanup passes, git wrappers, and a push planner. Most modules port near-verbatim from upstream; `source-transform.ts` is rewritten for Droppy's component conventions and `story-transform.ts` gains one fix.

**Tech Stack:** TypeScript, tsx, vitest (node environment), oxc-parser, magic-string, globby, jsonc-parser, simple-git, `@clack/prompts`, Biome (one rule only), Prettier.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-08-13-storybook-freeze-design.md`. Read it before starting.
- **Branch:** work on `feat/storybook-freeze` (already created, spec already committed).
- **Upstream source:** `/home/steve/Development/base-ui` at ref `origin/research`, path `packages/storybook-freeze/`. Read a file with `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/<name>.ts`. Never edit that repo.
- **Touch nothing under `src/`.** Story tags, MDX markers and `<Meta tags>` are being prepared in parallel sessions. This work adds tooling only.
- **Do not touch `pnpm-workspace.yaml`.** The tool is deliberately outside the workspace.
- **Code style:** Droppy's Prettier config — no semicolons, single quotes, 100 columns, `trailingComma: "es5"`. Every ported file must be restyled; do not paste upstream's semicolon style.
- **Import style:** `verbatimModuleSyntax` plus ESLint `consistent-type-imports` with `fixStyle: 'inline-type-imports'`, so write `import { simpleGit, type SimpleGit } from 'simple-git'`, never a separate `import type` line for a module you also import values from.
- **Error message prefix:** upstream throws `Base UI: storybook-freeze …`. Every ported message becomes `Droppy: storybook-freeze …`. Assertions on message substrings in the ported tests do not cover the prefix, so they keep passing.
- **Drop upstream's `/* eslint-disable no-await-in-loop */` and `/* eslint-enable no-await-in-loop */` pragmas.** That rule is not enabled in this repo and an inert disable directive is noise. Keep the prose comments that explain _why_ those loops are sequential.
- **Facet vocabulary** (`category.leaf`), fixed by Task 2: `source-jsdoc.{component,props}`; `csf-jsdoc.{meta,story}`; `mdx.{a11y,anatomy,behavior,brand,do-dont,examples,general,history,known-issues,props,styling,when-to-use}`; `general.{general-a11y,general-brand,general-do-dont,general-setup,general-tokens,general-when-to-use}`; `story.{animation,api-ref,examples,highlight,infra,showcase,tests}`. Always-deleted: `story.infra`. There is no `story.base` and no `mdx.testing`.
- **Every task ends with a commit.** Conventional-commit subjects, imperative mood. Add `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` as the last line of every commit message.
- **Run tests with** `pnpm experiment:test` (available from Task 1). A single file: `pnpm experiment:test src/labels.test.ts`.

---

## File Structure

Everything new, except three small edits to existing root files.

| File                                       | Responsibility                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `tools/storybook-freeze/package.json`      | Private manifest; declares the two bin entry points for provenance. No dependencies of its own. |
| `tools/storybook-freeze/tsconfig.json`     | Standalone `noEmit` config for `pnpm experiment:check`.                                         |
| `tools/storybook-freeze/vitest.config.ts`  | Node-environment test project.                                                                  |
| `src/oxc-utils.ts`                         | `parse()` and `leadingBlockComment()` — the only place oxc is touched directly.                 |
| `src/labels.ts`                            | Reads `classification-labels.jsonc` into a `Labels` value object.                               |
| `src/config.ts`                            | Loads and validates `experiments.config.ts`.                                                    |
| `src/manifest.ts`                          | Builds and writes `experiment.json`.                                                            |
| `src/source-transform.ts`                  | Strips component and props JSDoc from component sources. **Rewritten.**                         |
| `src/story-transform.ts`                   | Strips unkept story exports and CSF JSDoc. **One fix.**                                         |
| `src/mdx-transform.ts`                     | Strips `BEGIN:`/`END:` facet blocks; whole-file `general-*` gating.                             |
| `src/canvas-purge.ts`                      | Removes `<Canvas of={…} />` for removed exports and the headings they empty.                    |
| `src/deadcode.ts`                          | Removes unreferenced top-level declarations (oxc, fixpoint).                                    |
| `src/biome.ts`                             | Removes unused imports via one Biome rule.                                                      |
| `src/format.ts`                            | Prettier pass over written files.                                                               |
| `src/corpus.ts`                            | File discovery and per-file dispatch; the only place globs live.                                |
| `src/git.ts`                               | simple-git wrappers. The only place git is touched.                                             |
| `src/freeze.ts`                            | Per-branch orchestration.                                                                       |
| `src/cli.ts`                               | `experiment:freeze` entry point.                                                                |
| `src/publish-plan.ts`                      | Pure function: which branches to push.                                                          |
| `src/push-retry.ts`                        | Pure retry policy for transient push failures.                                                  |
| `src/publish-branches.ts`                  | `experiment:publish-branches` entry point.                                                      |
| `classification-labels.jsonc`              | Repo root. The taxonomy.                                                                        |
| `experiments.config.ts`                    | Repo root. One entry per branch.                                                                |
| `.github/workflows/experiment-preview.yml` | Publishes each `experiment/**` push to pkg.pr.new.                                              |
| `package.json`                             | **Modify:** four scripts, eight devDependencies.                                                |
| `eslint.config.js`                         | **Modify:** one config block for `tools/**/*.ts`.                                               |
| `.github/workflows/ci.yml`                 | **Modify:** two steps in the `verify` job.                                                      |

All `src/*.ts` paths above are relative to `tools/storybook-freeze/`. Each module gets a sibling `*.test.ts`.

---

### Task 1: Scaffold and oxc-utils

Sets up the tool's manifest, tsconfig, vitest project and root wiring, then lands the one module every transform depends on. Scaffolding is folded in here because it has no independently testable deliverable of its own.

**Files:**

- Create: `tools/storybook-freeze/package.json`
- Create: `tools/storybook-freeze/tsconfig.json`
- Create: `tools/storybook-freeze/vitest.config.ts`
- Create: `tools/storybook-freeze/src/oxc-utils.ts`
- Test: `tools/storybook-freeze/src/oxc-utils.test.ts`
- Modify: `package.json` (scripts, devDependencies)
- Modify: `eslint.config.js`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: nothing.
- Produces: `parse(filename: string, code: string): { program: any; comments: Comment[] }` and `leadingBlockComment(node: { start: number }, comments: Comment[], code: string): { start: number; end: number } | null`, plus `interface Comment { type: 'Line' | 'Block'; value: string; start: number; end: number }`. Every later transform imports both.

- [ ] **Step 1: Add the dependencies**

```bash
pnpm add -D -w @biomejs/biome @clack/prompts globby jsonc-parser magic-string oxc-parser simple-git tsx
```

If `-w` is rejected (this is not a multi-package workspace), drop it: `pnpm add -D @biomejs/biome @clack/prompts globby jsonc-parser magic-string oxc-parser simple-git tsx`. `prettier` is already a devDependency and is reused — do not add it again.

- [ ] **Step 2: Add the four scripts to the root `package.json`**

Insert after the existing `"release"` script:

```json
"experiment:freeze": "tsx tools/storybook-freeze/src/cli.ts",
"experiment:publish-branches": "tsx tools/storybook-freeze/src/publish-branches.ts",
"experiment:check": "tsc --noEmit -p tools/storybook-freeze",
"experiment:test": "vitest run --config tools/storybook-freeze/vitest.config.ts"
```

- [ ] **Step 3: Create the tool manifest**

`tools/storybook-freeze/package.json`:

```json
{
  "name": "@droppy/storybook-freeze",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "CLI that freezes the Storybook corpus into experiment branches for ML experiments.",
  "bin": {
    "storybook-freeze": "./src/cli.ts",
    "storybook-freeze-publish": "./src/publish-branches.ts"
  }
}
```

It declares no dependencies: the tool runs from the root `node_modules`, which is why the deps went into the root manifest in Step 1.

- [ ] **Step 4: Create the tool tsconfig**

`tools/storybook-freeze/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "preserve",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "vitest.config.ts", "../../experiments.config.ts"]
}
```

Three deliberate choices. It does **not** extend the root tsconfig, which is the library build config (`declaration` + `emitDeclarationOnly` into `dist`) and would try to emit `.d.ts` files for a CLI. It deliberately omits the root's `noUncheckedIndexedAccess`, because the ported code indexes AST arrays and regex match groups positionally throughout (`declarations[0]`, `match[1]`, `lines[i]`) and re-proving each access is churn with no payoff in a build-time tool. And it includes `../../experiments.config.ts`, which the tool imports at runtime, so the config is type-checked too.

- [ ] **Step 5: Create the vitest project**

`tools/storybook-freeze/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

// The root vitest.config.ts is a browser-only Storybook project; these are node
// unit tests over string-in, string-out transforms, so they need their own project.
export default defineConfig({
  test: {
    name: 'storybook-freeze',
    environment: 'node',
    root: import.meta.dirname,
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 6: Add the ESLint block**

In `eslint.config.js`, insert this object immediately before the final `prettier` entry:

```js
  {
    // The AST walkers work against oxc-parser's untyped ESTree output, so `any`
    // is the honest type here rather than a shortcut.
    files: ['tools/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
```

- [ ] **Step 7: Add the CI steps**

In `.github/workflows/ci.yml`, in the `verify` job, insert two steps immediately after the existing `- run: pnpm check` step:

```yaml
- run: pnpm experiment:check

- run: pnpm experiment:test
```

- [ ] **Step 8: Write the failing test**

`tools/storybook-freeze/src/oxc-utils.test.ts` — ported from upstream `src/oxc-utils.test.ts`, restyled:

```ts
import { describe, expect, it } from 'vitest'

import { leadingBlockComment, parse } from './oxc-utils'

describe('parse', () => {
  it('returns the program and its comments', () => {
    const { program, comments } = parse('a.tsx', '/** doc */\nexport const a = 1\n')
    expect(program.body).toHaveLength(1)
    expect(comments).toHaveLength(1)
    expect(comments[0].type).toBe('Block')
  })

  it('throws a Droppy error naming the file on a syntax error', () => {
    expect(() => parse('bad.tsx', 'const = = 1')).toThrow(/could not parse bad\.tsx/)
  })
})

describe('leadingBlockComment', () => {
  it('finds the block comment directly above a node', () => {
    const code = '/** doc */\nexport const a = 1\n'
    const { program, comments } = parse('a.tsx', code)
    const range = leadingBlockComment(program.body[0], comments, code)
    expect(range).not.toBeNull()
    expect(code.slice(range!.start, range!.end)).toBe('/** doc */\n')
  })

  it('ignores a block comment separated from the node by code', () => {
    const code = '/** doc */\nconst b = 2\nexport const a = 1\n'
    const { program, comments } = parse('a.tsx', code)
    expect(leadingBlockComment(program.body[1], comments, code)).toBeNull()
  })

  it('ignores line comments', () => {
    const code = '// doc\nexport const a = 1\n'
    const { program, comments } = parse('a.tsx', code)
    expect(leadingBlockComment(program.body[0], comments, code)).toBeNull()
  })
})
```

- [ ] **Step 9: Run the test to verify it fails**

Run: `pnpm experiment:test src/oxc-utils.test.ts`
Expected: FAIL — cannot resolve `./oxc-utils`.

- [ ] **Step 10: Port `oxc-utils.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/oxc-utils.ts`

Copy it verbatim into `tools/storybook-freeze/src/oxc-utils.ts`, restyled to Droppy's Prettier config, changing only the error prefix from `Base UI:` to `Droppy:`. The file is ~40 lines: a `Comment` interface, `parse()` wrapping `parseSync` and throwing on `errors.length > 0`, and `leadingBlockComment()` returning the widest range from the nearest preceding block comment to the node start, requiring the gap between them to be whitespace only.

- [ ] **Step 11: Run the tests to verify they pass**

Run: `pnpm experiment:test`
Expected: PASS, 5 tests.

- [ ] **Step 12: Verify the rest of the wiring**

Run: `pnpm experiment:check` — expected: no output, exit 0.
Run: `pnpm lint` — expected: no errors.
Run: `pnpm format:check` — expected: all files use Prettier code style. If it fails, run `pnpm format` and re-check.

- [ ] **Step 13: Commit**

```bash
git add tools/storybook-freeze package.json pnpm-lock.yaml eslint.config.js .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
feat: scaffold the storybook-freeze tool

Adds the tool manifest, its own noEmit tsconfig and node vitest project,
the four root scripts, and oxc-utils — the parse and leading-comment
helpers every transform builds on.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Taxonomy — labels.ts and classification-labels.jsonc

**Files:**

- Create: `classification-labels.jsonc`
- Create: `tools/storybook-freeze/src/labels.ts`
- Test: `tools/storybook-freeze/src/labels.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `loadLabels(jsoncPath: string): Labels` and

```ts
type Facet = string
interface Labels {
  definedFacets: Facet[]
  deleteFacets: ReadonlySet<Facet>
  storyTags: ReadonlySet<string>
  isKept(facet: Facet, keep: ReadonlySet<Facet>): boolean
}
```

Tasks 3, 6, 11, 13, 14 and 16 all consume `Labels`. Several tests construct a `Labels` literal directly rather than loading the real file.

- [ ] **Step 1: Create the taxonomy file**

`classification-labels.jsonc` at the repo root:

```jsonc
{
  // JSDoc in the component sources under src/components
  "source-jsdoc": {
    "component": "Description of the component function",
    "props": "Description of properties in the API / TS type",
  },
  // JSDoc in the CSF files
  "csf-jsdoc": {
    "meta": "Description of the CSF meta / component",
    "story": "Description of the story function",
  },
  // Facet blocks inside a component's MDX, delimited by {/* BEGIN: x */} … {/* END: x */}
  "mdx": {
    "general": "General component information",
    "behavior": "Explanation of component behaviour",
    "examples": "Real-world usage examples",
    "do-dont": "Do's and don'ts",
    "when-to-use": "When to use and not to use, alternatives",
    "anatomy": "The component anatomy",
    "history": "Decision history on the component",
    "known-issues": "Known issues and open questions about the component",
    "a11y": "A11y rules to follow",
    "brand": "Rules specific to the Droppy brand",
    "props": "API reference / props section (MDX)",
    "styling": "Styling hooks and token guidelines (MDX)",
  },
  // Repo-wide MDX in src/docs, matched whole-file by their <Meta tags={[...]} />
  "general": {
    "general-a11y": "General accessibility guidelines",
    "general-tokens": "Design tokens",
    "general-setup": "Setup guide",
    "general-brand": "Brand principles",
    "general-do-dont": "General usage guidelines",
    "general-when-to-use": "General component selection guidelines",
  },
  // Story tags
  "story": {
    "api-ref": "Stories for individual component props",
    "showcase": "One primary example showing the most relevant use case, with realistic data",
    "highlight": "Stories that clarify a specific point made in the documentation",
    "examples": "Real-world combinations of components extracted from products using Droppy",
    "tests": "Play-function stories for specific behaviors",
    "animation": "Stories demonstrating the transition/animation contract",
    "infra": "Storybook-internal stories for the docs' own tooling, not for a Droppy component",
  },
  // Content to always delete, whatever an experiment asks for
  "delete": ["story.infra"],
}
```

Differences from upstream, all deliberate and recorded in the spec: no `story.base` (base-ui-specific), no `mdx.testing` (Droppy has none), and `mdx.styling` is selectable rather than always-deleted.

- [ ] **Step 2: Write the failing test**

`tools/storybook-freeze/src/labels.test.ts` — upstream's tests rewritten for Droppy's taxonomy and path:

```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { loadLabels } from './labels'

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../../..')
const LABELS = path.join(ROOT, 'classification-labels.jsonc')

describe('loadLabels', () => {
  const labels = loadLabels(LABELS)

  it('offers every content category as qualified facets', () => {
    expect(labels.definedFacets).toContain('source-jsdoc.props')
    expect(labels.definedFacets).toContain('csf-jsdoc.meta')
    expect(labels.definedFacets).toContain('mdx.props')
    expect(labels.definedFacets).toContain('general.general-setup')
    expect(labels.definedFacets).toContain('story.showcase')
  })

  it('offers mdx.styling, which base-ui always deletes', () => {
    expect(labels.definedFacets).toContain('mdx.styling')
  })

  it('never offers a delete facet', () => {
    expect(labels.definedFacets).not.toContain('story.infra')
  })

  it('does not define base-ui-only facets', () => {
    expect(labels.definedFacets).not.toContain('story.base')
    expect(labels.definedFacets).not.toContain('mdx.testing')
  })

  it('returns the facets sorted', () => {
    expect(labels.definedFacets).toEqual([...labels.definedFacets].sort())
  })

  it('exposes bare story tag leaves, including deleted ones', () => {
    expect(labels.storyTags.has('showcase')).toBe(true)
    expect(labels.storyTags.has('infra')).toBe(true)
    expect(labels.storyTags.has('base')).toBe(false)
  })

  it('isKept is false for a delete facet even when it is in the keep set', () => {
    expect(labels.isKept('story.infra', new Set(['story.infra']))).toBe(false)
    expect(labels.isKept('story.showcase', new Set(['story.showcase']))).toBe(true)
  })

  it('isKept is false for a facet absent from the keep set', () => {
    expect(labels.isKept('story.showcase', new Set())).toBe(false)
  })
})
```

`storyTags` deliberately includes `infra`: `story-transform` uses it to recognise which of a story's tags are classification tags at all, and only then asks `isKept` whether to keep it.

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm experiment:test src/labels.test.ts`
Expected: FAIL — cannot resolve `./labels`.

- [ ] **Step 4: Port `labels.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/labels.ts`

Copy verbatim, restyled. It parses the JSONC with `jsonc-parser`, walks `CONTENT_CATEGORIES = ['source-jsdoc', 'csf-jsdoc', 'mdx', 'general', 'story']`, builds `category.leaf` facets while skipping delete facets, collects every `story` leaf into `storyTags`, sorts `definedFacets`, and returns `isKept` as `(facet, keep) => !deleteFacets.has(facet) && keep.has(facet)`. No behavioural change is needed — the file is taxonomy-agnostic.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm experiment:test`
Expected: PASS, 13 tests.

- [ ] **Step 6: Commit**

```bash
git add classification-labels.jsonc tools/storybook-freeze/src/labels.ts tools/storybook-freeze/src/labels.test.ts
git commit -m "$(cat <<'EOF'
feat: add the classification taxonomy and its loader

Drops base-ui's story.base and mdx.testing, and makes mdx.styling a
selectable facet rather than always-deleted content: Droppy documents its
own token hooks in those sections.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Experiment config — config.ts and experiments.config.ts

**Files:**

- Create: `experiments.config.ts`
- Create: `tools/storybook-freeze/src/config.ts`
- Test: `tools/storybook-freeze/src/config.test.ts`

**Interfaces:**

- Consumes: `Labels` from Task 2.
- Produces: `interface ExperimentConfig { branchName: string; facets: string[] }`, `CONFIG_FILENAME = 'experiments.config.ts'`, `loadExperiments(cwd: string): Promise<unknown>`, `validateExperiments(raw: unknown, labels: Labels): ExperimentConfig[]`. Tasks 13, 14 and 16 consume these.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/config.test.ts` — ported from upstream, restyled, with the describe name and the `Base UI` wording updated:

```ts
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { loadExperiments, validateExperiments } from './config'
import { type Labels } from './labels'

const labels: Labels = {
  definedFacets: ['story.showcase', 'story.api-ref', 'mdx.general'],
  deleteFacets: new Set(['story.infra']),
  storyTags: new Set(['showcase', 'api-ref', 'infra']),
  isKept: (f, keep) => f !== 'story.infra' && keep.has(f),
}

describe('validateExperiments', () => {
  it('accepts a well-formed config', () => {
    const raw = [
      { branchName: 'experiment/showcase', facets: ['story.showcase'] },
      { branchName: 'experiment/api', facets: ['story.api-ref', 'mdx.general'] },
    ]
    expect(validateExperiments(raw, labels)).toEqual(raw)
  })

  it('accepts an entry with no facets at all', () => {
    const raw = [{ branchName: 'experiment/empty', facets: [] }]
    expect(validateExperiments(raw, labels)).toEqual(raw)
  })

  it('rejects a non-array default export', () => {
    expect(() => validateExperiments({}, labels)).toThrow(/must default-export an array/)
  })

  it('rejects a branchName without the experiment/ prefix', () => {
    const raw = [{ branchName: 'showcase', facets: ['story.showcase'] }]
    expect(() => validateExperiments(raw, labels)).toThrow(/invalid branchName/)
  })

  it('rejects duplicate branch names', () => {
    const raw = [
      { branchName: 'experiment/x', facets: ['story.showcase'] },
      { branchName: 'experiment/x', facets: ['story.api-ref'] },
    ]
    expect(() => validateExperiments(raw, labels)).toThrow(/more than once/)
  })

  it('rejects unknown facets', () => {
    const raw = [{ branchName: 'experiment/x', facets: ['story.showcase', 'story.nope'] }]
    expect(() => validateExperiments(raw, labels)).toThrow(/unknown facets: story\.nope/)
  })

  it('rejects a delete facet, which is never selectable', () => {
    const raw = [{ branchName: 'experiment/x', facets: ['story.infra'] }]
    expect(() => validateExperiments(raw, labels)).toThrow(/unknown facets: story\.infra/)
  })

  it('rejects a non-string facets list', () => {
    const raw = [{ branchName: 'experiment/x', facets: 'story.showcase' }]
    expect(() => validateExperiments(raw, labels)).toThrow(/invalid facets list/)
  })
})

describe('loadExperiments', () => {
  it('throws a Droppy error when the config file is missing', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'freeze-config-'))
    try {
      await expect(loadExperiments(dir)).rejects.toThrow(/could not find experiments\.config\.ts/)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
```

The delete-facet case is new, and passes for free: `definedFacets` excludes delete facets, so a config asking for one is reported as unknown.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/config.test.ts`
Expected: FAIL — cannot resolve `./config`.

- [ ] **Step 3: Port `config.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/config.ts`

Copy verbatim, restyled, with `Base UI:` → `Droppy:` in all five error messages. `loadExperiments` checks `existsSync` then dynamic-imports through `pathToFileURL`, returning the default export. `validateExperiments` maps the raw array, checking in order: entry is an object; `branchName` is a string starting with `experiment/`; `branchName` is unique; `facets` is an array of strings; every facet is in `labels.definedFacets`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test`
Expected: PASS, 22 tests.

- [ ] **Step 5: Create `experiments.config.ts`**

At the repo root. This is upstream's list with `story.base` gone from `BASE_FACETS`, `mdx.styling` added to `full`, `stories-showcase` promoted to a live entry (upstream had it commented out for want of a showcase story; Droppy has one per component), and upstream's `product-examples` entry dropped rather than carried over commented out.

```ts
/**
 * Experiments for the storybook-freeze CLI (`pnpm experiment:freeze`).
 *
 * Each entry regenerates one git branch containing only the listed facets; everything else is
 * stripped from the Storybook corpus. Facets are qualified `category.leaf` labels from
 * `classification-labels.jsonc`, excluding the always-stripped delete facets. Every
 * `branchName` must start with `experiment/`.
 *
 * Unlike base-ui, no story facet is pinned into every branch: there is no Droppy equivalent of
 * base-ui's `story.base` baseline, so a branch that selects no story facets genuinely has no
 * stories, and `experiment/empty` is an empty Storybook by design.
 *
 * After regenerating, `pnpm experiment:publish-branches` force-pushes the branches to origin;
 * each push triggers the "Experiment preview" workflow, which publishes that branch's
 * @droppy/design-system build to pkg.pr.new.
 */
interface Experiment {
  branchName: string
  facets: string[]
}

/** Documentation every branch keeps, so branches differ only in the facets under test. */
const BASE_FACETS = [
  'source-jsdoc.component',
  'source-jsdoc.props',
  'csf-jsdoc.meta',
  'csf-jsdoc.story',
  'mdx.anatomy',
  'general.general-setup',
  'general.general-brand',
]

const ALL_MDX = [
  'mdx.general',
  'mdx.behavior',
  'mdx.examples',
  'mdx.do-dont',
  'mdx.when-to-use',
  'mdx.anatomy',
  'mdx.history',
  'mdx.known-issues',
  'mdx.a11y',
  'mdx.brand',
  'mdx.props',
  'mdx.styling',
]

const ALL_GENERAL = [
  'general.general-a11y',
  'general.general-tokens',
  'general.general-setup',
  'general.general-brand',
  'general.general-do-dont',
  'general.general-when-to-use',
]

const ALL_STORIES = [
  'story.api-ref',
  'story.showcase',
  'story.highlight',
  'story.examples',
  'story.animation',
  'story.tests',
]

const experiments: Experiment[] = [
  {
    branchName: 'experiment/empty',
    facets: [],
  },
  {
    branchName: 'experiment/base',
    facets: BASE_FACETS,
  },
  {
    branchName: 'experiment/full',
    facets: [...new Set([...BASE_FACETS, ...ALL_MDX, ...ALL_GENERAL, ...ALL_STORIES])],
  },
  {
    branchName: 'experiment/basic-docs',
    facets: [...BASE_FACETS, 'mdx.general', 'mdx.behavior', 'story.showcase', 'story.highlight'],
  },
  {
    branchName: 'experiment/do-dont',
    facets: [...BASE_FACETS, 'mdx.do-dont', 'general.general-do-dont'],
  },
  {
    branchName: 'experiment/when-to-use',
    facets: [...BASE_FACETS, 'mdx.when-to-use', 'general.general-when-to-use'],
  },
  {
    branchName: 'experiment/history-issues',
    facets: [...BASE_FACETS, 'mdx.history', 'mdx.known-issues'],
  },
  {
    branchName: 'experiment/a11y',
    facets: [...BASE_FACETS, 'mdx.a11y', 'general.general-a11y'],
  },
  {
    branchName: 'experiment/brand-animation',
    facets: [...BASE_FACETS, 'mdx.brand', 'story.animation'],
  },
  {
    branchName: 'experiment/api-ref',
    facets: [...BASE_FACETS, 'mdx.props', 'story.api-ref', 'story.highlight'],
  },
  {
    branchName: 'experiment/docs-full',
    facets: [
      ...BASE_FACETS,
      'mdx.general',
      'mdx.behavior',
      'mdx.do-dont',
      'mdx.when-to-use',
      'mdx.history',
      'mdx.known-issues',
      'mdx.a11y',
      'general.general-a11y',
      'general.general-tokens',
      'general.general-do-dont',
      'general.general-when-to-use',
    ],
  },
  {
    branchName: 'experiment/stories-api-ref',
    facets: [...BASE_FACETS, 'story.api-ref'],
  },
  {
    branchName: 'experiment/stories-showcase',
    facets: [...BASE_FACETS, 'story.showcase'],
  },
  {
    branchName: 'experiment/stories-highlight',
    facets: [...BASE_FACETS, 'story.highlight'],
  },
  {
    branchName: 'experiment/stories-examples',
    facets: [...BASE_FACETS, 'story.examples'],
  },
  {
    branchName: 'experiment/stories-full',
    facets: [...BASE_FACETS, ...ALL_STORIES],
  },
  {
    // Everything except the JSDoc in the component sources, to isolate what that JSDoc is worth.
    branchName: 'experiment/purge-jsdoc',
    facets: ['csf-jsdoc.meta', 'csf-jsdoc.story', ...ALL_MDX, ...ALL_GENERAL, ...ALL_STORIES],
  },
]

export default experiments
```

- [ ] **Step 6: Verify the config validates against the real taxonomy**

Add this test to the end of `config.test.ts`:

```ts
describe('the repo experiments.config.ts', () => {
  it('validates against the real taxonomy', async () => {
    const root = path.resolve(fileURLToPath(import.meta.url), '../../../..')
    const labelsFromDisk = loadLabels(path.join(root, 'classification-labels.jsonc'))
    const validated = validateExperiments(await loadExperiments(root), labelsFromDisk)
    expect(validated).toHaveLength(17)
    expect(validated.map((entry) => entry.branchName)).toContain('experiment/full')
  })
})
```

Add `import { fileURLToPath } from 'node:url'` and `loadLabels` to that file's imports.

Run: `pnpm experiment:test src/config.test.ts`
Expected: PASS. A failure here means a facet name in `experiments.config.ts` does not match `classification-labels.jsonc`; the thrown message names the offender.

- [ ] **Step 7: Verify types and lint**

Run: `pnpm experiment:check` — expected: exit 0. This is the first run that type-checks `experiments.config.ts`.
Run: `pnpm lint` — expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add experiments.config.ts tools/storybook-freeze/src/config.ts tools/storybook-freeze/src/config.test.ts
git commit -m "$(cat <<'EOF'
feat: add the experiment config and its validator

Seventeen branches: base-ui's sixteen with story.base dropped from the
shared facets, plus stories-showcase, which upstream left commented out
for want of a showcase story.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: manifest.ts

**Files:**

- Create: `tools/storybook-freeze/src/manifest.ts`
- Test: `tools/storybook-freeze/src/manifest.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `interface Manifest { branchName: string; baseCommit: string; keptFacets: string[]; createdAt: string; version: number }`, `buildManifest(args: Manifest): Manifest` (sorts `keptFacets`, does not mutate the input), `writeManifest(cwd: string, manifest: Manifest): Promise<string>` (writes `<cwd>/experiment.json`, returns the path). Task 13 consumes both. **`version` is a `number`.**

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/manifest.test.ts` — ported from upstream, restyled:

```ts
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { buildManifest, writeManifest } from './manifest'

const args = {
  branchName: 'experiment/showcase',
  baseCommit: 'abc123',
  keptFacets: ['story.showcase', 'mdx.general'],
  createdAt: '2026-08-13T00:00:00.000Z',
  version: 1,
}

describe('buildManifest', () => {
  it('sorts the kept facets', () => {
    expect(buildManifest(args).keptFacets).toEqual(['mdx.general', 'story.showcase'])
  })

  it('does not mutate the facets it was given', () => {
    const facets = ['story.showcase', 'mdx.general']
    buildManifest({ ...args, keptFacets: facets })
    expect(facets).toEqual(['story.showcase', 'mdx.general'])
  })

  it('passes the other fields through', () => {
    const manifest = buildManifest(args)
    expect(manifest.branchName).toBe('experiment/showcase')
    expect(manifest.baseCommit).toBe('abc123')
    expect(manifest.createdAt).toBe('2026-08-13T00:00:00.000Z')
    expect(manifest.version).toBe(1)
  })
})

describe('writeManifest', () => {
  it('writes experiment.json at the repo root with a trailing newline', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'freeze-manifest-'))
    try {
      const written = await writeManifest(dir, buildManifest(args))
      expect(written).toBe(path.join(dir, 'experiment.json'))
      const raw = await readFile(written, 'utf8')
      expect(raw.endsWith('\n')).toBe(true)
      expect(JSON.parse(raw).branchName).toBe('experiment/showcase')
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/manifest.test.ts`
Expected: FAIL — cannot resolve `./manifest`.

- [ ] **Step 3: Port `manifest.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/manifest.ts`

Copy verbatim, restyled. ~35 lines, no changes beyond style.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test`
Expected: PASS, 28 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/manifest.ts tools/storybook-freeze/src/manifest.test.ts
git commit -m "$(cat <<'EOF'
feat: add the experiment.json manifest writer

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: source-transform.ts — rewritten for Droppy's conventions

The one module that cannot be ported. base-ui keys component JSDoc off `export namespace X` declarations and props JSDoc off `export interface XProps`; Droppy has neither.

**Files:**

- Create: `tools/storybook-freeze/src/source-transform.ts`
- Test: `tools/storybook-freeze/src/source-transform.test.ts`

**Interfaces:**

- Consumes: `parse`, `leadingBlockComment` from Task 1.
- Produces: `interface TransformResult { code: string; changed: boolean }` and `transformSource(filename: string, code: string, keep: ReadonlySet<string>): TransformResult`. Task 11 consumes it. Note Task 9 exports an identically-shaped `TransformResult` of its own; they are separate declarations, not shared.

Droppy's shape, from `src/components/Badge/Badge.tsx`:

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

So prop docs live on the members of a **local, non-exported** `type DefaultProps = { … }`, and the component doc is a block comment on an exported `const`.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/source-transform.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { transformSource } from './source-transform'

/** Droppy's dominant shape: docs on a local type alias, doc on an exported arrow const. */
const SOURCE = [
  "import type { ComponentProps } from 'react'",
  '',
  'type DefaultProps = {',
  '  /** The label. Rendered capitalized regardless of the casing passed in. */',
  '  text: string',
  '  /** `positive` matches the look of an affirmative flag. */',
  "  variant?: 'neutral' | 'positive'",
  '  className?: string',
  '}',
  '',
  "export type BadgeProps = DefaultProps & Omit<ComponentProps<'span'>, keyof DefaultProps>",
  '',
  '/** A short status flag. */',
  'export const Badge = ({ text, variant, className }: BadgeProps) => null',
  '',
].join('\n')

const BOTH = new Set(['source-jsdoc.component', 'source-jsdoc.props'])

describe('transformSource', () => {
  it('keeps everything when both facets are kept', () => {
    const result = transformSource('Badge.tsx', SOURCE, BOTH)
    expect(result.changed).toBe(false)
    expect(result.code).toBe(SOURCE)
  })

  it('removes the component JSDoc on an exported const', () => {
    const result = transformSource('Badge.tsx', SOURCE, new Set(['source-jsdoc.props']))
    expect(result.changed).toBe(true)
    expect(result.code).not.toContain('A short status flag.')
    expect(result.code).toContain('export const Badge')
    expect(result.code).toContain('The label. Rendered capitalized')
  })

  it('removes the component JSDoc on an exported function declaration', () => {
    const code = ['/** A card. */', 'export function Card() {', '  return null', '}', ''].join('\n')
    const result = transformSource('Card.tsx', code, new Set(['source-jsdoc.props']))
    expect(result.code).not.toContain('A card.')
    expect(result.code).toContain('export function Card')
  })

  it('removes member JSDoc from a local *Props type alias', () => {
    const result = transformSource('Badge.tsx', SOURCE, new Set(['source-jsdoc.component']))
    expect(result.changed).toBe(true)
    expect(result.code).not.toContain('The label. Rendered capitalized')
    expect(result.code).not.toContain('affirmative flag')
    expect(result.code).toContain('text: string')
    expect(result.code).toContain("variant?: 'neutral' | 'positive'")
    expect(result.code).toContain('A short status flag.')
  })

  it('removes member JSDoc from an object literal inside an intersection', () => {
    const code = [
      'export type CardProps = {',
      '  /** Hover dim plus pointer cursor. */',
      '  interactive?: boolean',
      "} & ComponentProps<'div'>",
      '',
    ].join('\n')
    const result = transformSource('Card.tsx', code, new Set(['source-jsdoc.component']))
    expect(result.code).not.toContain('Hover dim plus pointer cursor.')
    expect(result.code).toContain('interactive?: boolean')
  })

  it('removes member JSDoc from an interface, for components written that way', () => {
    const code = [
      'export interface InputProps {',
      '  /** The current value. */',
      '  value?: string',
      '}',
      '',
    ].join('\n')
    const result = transformSource('Input.tsx', code, new Set(['source-jsdoc.component']))
    expect(result.code).not.toContain('The current value.')
    expect(result.code).toContain('value?: string')
  })

  it('leaves non-props types documented', () => {
    const code = [
      'type Order = {',
      '  /** Cents, not currency units. */',
      '  total: number',
      '}',
      '',
    ].join('\n')
    const result = transformSource('Review.tsx', code, new Set(['source-jsdoc.component']))
    expect(result.changed).toBe(false)
    expect(result.code).toContain('Cents, not currency units.')
  })

  it('does not mistake a documented type alias above a component for its component JSDoc', () => {
    const code = [
      '/** The props, documented as a whole. */',
      'type DefaultProps = { className?: string }',
      'export const Badge = () => null',
      '',
    ].join('\n')
    const result = transformSource('Badge.tsx', code, new Set(['source-jsdoc.props']))
    expect(result.code).toContain('The props, documented as a whole.')
  })

  it('removes both kinds when neither facet is kept', () => {
    const result = transformSource('Badge.tsx', SOURCE, new Set())
    expect(result.code).not.toContain('A short status flag.')
    expect(result.code).not.toContain('The label. Rendered capitalized')
  })
})
```

The last-but-one case guards a real hazard: `leadingBlockComment` walks backwards for the nearest block comment, so a documented declaration sitting directly above the component export must not have its comment claimed as the component's.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/source-transform.test.ts`
Expected: FAIL — cannot resolve `./source-transform`.

- [ ] **Step 3: Write the implementation**

`tools/storybook-freeze/src/source-transform.ts`:

```ts
import MagicString from 'magic-string'

import { leadingBlockComment, parse } from './oxc-utils'

export interface TransformResult {
  code: string
  changed: boolean
}

/**
 * Every object-literal type reachable from a type annotation, descending through intersections
 * and unions. Droppy writes props as `DefaultProps & Omit<ComponentProps<'div'>, …>`, so the
 * documented members can sit in either operand.
 */
function typeLiterals(node: any, found: any[] = []): any[] {
  if (!node || typeof node !== 'object') {
    return found
  }
  if (node.type === 'TSTypeLiteral') {
    found.push(node)
    return found
  }
  if (node.type === 'TSIntersectionType' || node.type === 'TSUnionType') {
    for (const member of node.types ?? []) {
      typeLiterals(member, found)
    }
  }
  if (node.type === 'TSParenthesizedType') {
    typeLiterals(node.typeAnnotation, found)
  }
  return found
}

/**
 * Strip the JSDoc that documents components and their props.
 *
 * Droppy documents a component with a block comment on its exported declaration, and its props
 * on the members of a `*Props` type — usually the local `type DefaultProps = { … }` rather than
 * the exported alias built from it. Both are matched structurally rather than by name, except
 * for the `Props` suffix, which is what separates a props type from a mock-data type.
 */
export function transformSource(
  filename: string,
  code: string,
  keep: ReadonlySet<string>
): TransformResult {
  const keepComponent = keep.has('source-jsdoc.component')
  const keepProps = keep.has('source-jsdoc.props')
  if (keepComponent && keepProps) {
    return { code, changed: false }
  }

  const { program, comments } = parse(filename, code)
  const ms = new MagicString(code)
  let changed = false

  const strip = (node: { start: number }): void => {
    const range = leadingBlockComment(node, comments, code)
    if (range) {
      ms.remove(range.start, range.end)
      changed = true
    }
  }

  for (const node of program.body) {
    const exported = node.type === 'ExportNamedDeclaration'
    const declaration = exported ? node.declaration : node
    if (!declaration) {
      continue
    }

    const isComponentDeclaration =
      declaration.type === 'VariableDeclaration' || declaration.type === 'FunctionDeclaration'
    if (!keepComponent && exported && isComponentDeclaration) {
      strip(node)
    }

    if (keepProps) {
      continue
    }
    const named = declaration.id?.type === 'Identifier' ? declaration.id.name : undefined
    if (!named?.endsWith('Props')) {
      continue
    }
    if (declaration.type === 'TSInterfaceDeclaration') {
      for (const member of declaration.body?.body ?? []) {
        strip(member)
      }
    }
    if (declaration.type === 'TSTypeAliasDeclaration') {
      for (const literal of typeLiterals(declaration.typeAnnotation)) {
        for (const member of literal.members ?? []) {
          strip(member)
        }
      }
    }
  }

  return { code: changed ? ms.toString() : code, changed }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/source-transform.test.ts`
Expected: PASS, 9 tests.

If the type-alias cases fail with nothing stripped, the oxc field names differ from the assumption. Print the shape and adjust:

```bash
pnpm exec tsx -e "import {parseSync} from 'oxc-parser'; console.log(JSON.stringify(parseSync('a.tsx','type AProps = { /** d */ a: string }').program.body[0], null, 2))"
```

The two fields this code assumes are `TSTypeAliasDeclaration.typeAnnotation` and `TSTypeLiteral.members`. Fix the names, not the tests.

- [ ] **Step 5: Sanity-check against a real component**

Run:

```bash
pnpm exec tsx -e "
import { readFileSync } from 'node:fs'
import { transformSource } from './tools/storybook-freeze/src/source-transform.ts'
const file = 'src/components/Badge/Badge.tsx'
const code = readFileSync(file, 'utf8')
console.log(transformSource(file, code, new Set()).code)
"
```

Expected: the file prints with its JSDoc comments gone and every declaration intact. This reads `src/` but does not write to it.

- [ ] **Step 6: Commit**

```bash
git add tools/storybook-freeze/src/source-transform.ts tools/storybook-freeze/src/source-transform.test.ts
git commit -m "$(cat <<'EOF'
feat: strip component and props JSDoc from sources

Rewritten rather than ported: base-ui keys this off `export namespace X`
and `export interface XProps`, while Droppy documents props on the members
of a local `type DefaultProps` and the component on its exported const.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: story-transform.ts — port plus the `satisfies` fix

**Files:**

- Create: `tools/storybook-freeze/src/story-transform.ts`
- Test: `tools/storybook-freeze/src/story-transform.test.ts`

**Interfaces:**

- Consumes: `parse`, `leadingBlockComment` from Task 1; `Labels` from Task 2.
- Produces:

```ts
interface StoryTransformResult {
  code: string
  changed: boolean
  removedStoryExports: number
  remainingStoryExports: number
  removedStoryNames: string[]
}
transformStory(filename: string, code: string, keep: ReadonlySet<string>, labels: Labels): StoryTransformResult
```

Task 11 consumes it, and relies on `remainingStoryExports === 0 && removedStoryExports > 0` to decide a file is fully pruned.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/story-transform.test.ts` — upstream's tests restyled, with `story.base` removed from the fixture (no such facet here) and a new case for the `satisfies` fix:

```ts
import { describe, expect, it } from 'vitest'

import { type Labels } from './labels'
import { transformStory } from './story-transform'

const labels: Labels = {
  definedFacets: [],
  deleteFacets: new Set(['story.infra']),
  storyTags: new Set(['showcase', 'highlight', 'api-ref', 'infra']),
  isKept: (f, keep) => f !== 'story.infra' && keep.has(f),
}

const STORY = [
  '/** File-level component description. */',
  'const meta = {',
  "  title: 'Feedback & status/Spinner',",
  '} satisfies Meta<typeof Spinner>',
  'export default meta',
  'type Story = StoryObj<typeof meta>',
  '',
  '/** Hero demo. */',
  "export const Hero: Story = { tags: ['showcase'], render: () => null }",
  '',
  '/** An api-ref story. */',
  "export const Details: Story = { tags: ['api-ref'], render: () => null }",
  '',
].join('\n')

describe('transformStory', () => {
  it('keeps only exports whose tag is kept and drops the rest', () => {
    const result = transformStory('S.stories.tsx', STORY, new Set(['story.showcase']), labels)
    expect(result.code).toContain('export const Hero')
    expect(result.code).not.toContain('export const Details')
    expect(result.removedStoryExports).toBe(1)
    expect(result.remainingStoryExports).toBe(1)
  })

  it('reports the names of the removed story exports', () => {
    const result = transformStory('S.stories.tsx', STORY, new Set(['story.showcase']), labels)
    expect(result.removedStoryNames).toEqual(['Details'])
  })

  it('drops an untagged story, since nothing marks it as kept', () => {
    const code = [
      'const meta = {} satisfies Meta',
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      'export const Bare: Story = { render: () => null }',
      '',
    ].join('\n')
    const result = transformStory('S.stories.tsx', code, new Set(['story.showcase']), labels)
    expect(result.code).not.toContain('export const Bare')
    expect(result.removedStoryExports).toBe(1)
  })

  it('reads meta-level tags through a satisfies expression', () => {
    const code = [
      "const meta = { tags: ['showcase'] } satisfies Meta<typeof Spinner>",
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      'export const Inherited: Story = { render: () => null }',
      '',
    ].join('\n')
    const result = transformStory('S.stories.tsx', code, new Set(['story.showcase']), labels)
    expect(result.code).toContain('export const Inherited')
    expect(result.remainingStoryExports).toBe(1)
  })

  it('reads meta-level tags through an as expression', () => {
    const code = [
      "const meta = { tags: ['showcase'] } as Meta<typeof Spinner>",
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      'export const Inherited: Story = { render: () => null }',
      '',
    ].join('\n')
    const result = transformStory('S.stories.tsx', code, new Set(['story.showcase']), labels)
    expect(result.code).toContain('export const Inherited')
  })

  it('lets a story tag stand alongside inherited meta tags', () => {
    const code = [
      "const meta = { tags: ['showcase'] } satisfies Meta<typeof Spinner>",
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      "export const Detail: Story = { tags: ['api-ref'], render: () => null }",
      '',
    ].join('\n')
    const result = transformStory('S.stories.tsx', code, new Set(['story.api-ref']), labels)
    expect(result.code).toContain('export const Detail')
  })

  it('strips the meta JSDoc when csf-jsdoc.meta is not kept', () => {
    const keep = new Set(['story.showcase', 'story.api-ref'])
    const result = transformStory('S.stories.tsx', STORY, keep, labels)
    expect(result.code).not.toContain('File-level component description.')
  })

  it('strips per-story JSDoc when csf-jsdoc.story is not kept', () => {
    const keep = new Set(['story.showcase', 'story.api-ref'])
    const result = transformStory('S.stories.tsx', STORY, keep, labels)
    expect(result.code).not.toContain('Hero demo.')
    expect(result.code).not.toContain('An api-ref story.')
  })

  it('keeps CSF JSDoc when both csf-jsdoc facets are kept', () => {
    const keep = new Set(['story.showcase', 'story.api-ref', 'csf-jsdoc.meta', 'csf-jsdoc.story'])
    const result = transformStory('S.stories.tsx', STORY, keep, labels)
    expect(result.code).toContain('File-level component description.')
    expect(result.code).toContain('Hero demo.')
  })

  it('supports an inline StoryObj annotation as well as the Story alias', () => {
    const code = [
      'const meta = { title: "Spinner" } satisfies Meta',
      'export default meta',
      "export const Hero: StoryObj<typeof meta> = { tags: ['showcase'], render: () => null }",
      '',
    ].join('\n')
    const result = transformStory('S.stories.tsx', code, new Set(['story.showcase']), labels)
    expect(result.code).toContain('export const Hero')
  })

  it('always strips story.infra exports, because delete wins over keep', () => {
    const code = [
      'const meta = {} satisfies Meta',
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      "export const Anatomy: Story = { tags: ['infra'], render: () => null }",
      '',
    ].join('\n')
    const result = transformStory('A.stories.tsx', code, new Set(['story.infra']), labels)
    expect(result.code).not.toContain('export const Anatomy')
    expect(result.remainingStoryExports).toBe(0)
    expect(result.removedStoryExports).toBe(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/story-transform.test.ts`
Expected: FAIL — cannot resolve `./story-transform`.

- [ ] **Step 3: Port `story-transform.ts` and apply the fix**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/story-transform.ts`

Copy it, restyled. It finds the `meta` declaration and its `tags`, removes the meta's leading block comment unless `csf-jsdoc.meta` is kept, then for each `export const X: Story | StoryObj<…>` computes the union of meta tags and story tags narrowed to `labels.storyTags`, keeps the export if any of those tags satisfies `labels.isKept('story.' + tag, keep)`, and otherwise removes the export together with its leading comment and trailing newline.

Then apply the one fix. Droppy writes `const meta = { … } satisfies Meta<typeof X>`, so the declarator's `init` is a `TSSatisfiesExpression` and upstream's `tagsOf` — which tests for `ObjectExpression` — silently returns `[]`, losing meta-level tags. Add:

```ts
/** `{ … } satisfies Meta<typeof X>` and `{ … } as Meta` — read through to the object. */
function unwrapAssertions(node: any): any {
  let current = node
  while (current?.type === 'TSSatisfiesExpression' || current?.type === 'TSAsExpression') {
    current = current.expression
  }
  return current
}
```

and make `tagsOf` start with `const objectExpression = unwrapAssertions(node)`, taking its parameter as the raw initializer. This covers the story initializers too, at no cost.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/story-transform.test.ts`
Expected: PASS, 11 tests. The two `satisfies`/`as` cases are the ones that fail without the fix.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/story-transform.ts tools/storybook-freeze/src/story-transform.test.ts
git commit -m "$(cat <<'EOF'
feat: strip unkept story exports and CSF JSDoc

Ported with one fix: Droppy writes `const meta = {…} satisfies Meta<…>`,
so reading `tags` off the initializer has to see through the assertion.
Upstream returned no tags at all for that shape.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: mdx-transform.ts

**Files:**

- Create: `tools/storybook-freeze/src/mdx-transform.ts`
- Test: `tools/storybook-freeze/src/mdx-transform.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `interface MdxTransformResult { code: string; changed: boolean; deleteFile: boolean }`, `interface StarImport { alias: string; specifier: string }`, `starImports(code: string): StarImport[]`, `starImportSpecifiers(code: string): string[]`, `transformMdx(filename: string, code: string, keep: ReadonlySet<string>): MdxTransformResult`. Task 11 consumes `starImports` and `transformMdx`.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/mdx-transform.test.ts` — upstream's tests restyled, plus a case for the twice-per-file `when-to-use` block that every Droppy component MDX has:

```ts
import { describe, expect, it } from 'vitest'

import { starImports, transformMdx } from './mdx-transform'

describe('transformMdx facet blocks', () => {
  const code = [
    '# Spinner',
    '',
    '{/* BEGIN: general */}',
    'keep me',
    '{/* END: general */}',
    '',
    '{/* BEGIN: styling */}',
    'drop me',
    '{/* END: styling */}',
    '',
  ].join('\n')

  it('keeps a block whose facet is kept', () => {
    const result = transformMdx('S.mdx', code, new Set(['mdx.general', 'mdx.styling']))
    expect(result.changed).toBe(false)
    expect(result.code).toContain('keep me')
    expect(result.code).toContain('drop me')
  })

  it('removes a block whose facet is not kept', () => {
    const result = transformMdx('S.mdx', code, new Set(['mdx.general']))
    expect(result.changed).toBe(true)
    expect(result.code).toContain('keep me')
    expect(result.code).not.toContain('drop me')
    expect(result.code).not.toContain('BEGIN: styling')
  })

  it('removes every occurrence of a repeated facet', () => {
    const repeated = [
      '{/* BEGIN: when-to-use */}',
      'when to use',
      '{/* END: when-to-use */}',
      '',
      '{/* BEGIN: a11y */}',
      'keep me',
      '{/* END: a11y */}',
      '',
      '{/* BEGIN: when-to-use */}',
      'related links',
      '{/* END: when-to-use */}',
      '',
    ].join('\n')
    const result = transformMdx('S.mdx', repeated, new Set(['mdx.a11y']))
    expect(result.code).not.toContain('when to use')
    expect(result.code).not.toContain('related links')
    expect(result.code).toContain('keep me')
  })

  it('never sets deleteFile for a component doc', () => {
    expect(transformMdx('S.mdx', code, new Set()).deleteFile).toBe(false)
  })

  it('leaves an unterminated block alone rather than guessing where it ends', () => {
    const unterminated = ['{/* BEGIN: styling */}', 'drop me', ''].join('\n')
    const result = transformMdx('S.mdx', unterminated, new Set())
    expect(result.changed).toBe(false)
    expect(result.code).toContain('drop me')
  })
})

describe('transformMdx whole-file general docs', () => {
  const code = [
    "import { Meta } from '@storybook/addon-docs/blocks'",
    '',
    '<Meta',
    '  title="Accessibility guidelines"',
    "  tags={['general-a11y']}",
    '/>',
    '',
    '# Accessibility guidelines',
    '',
  ].join('\n')

  it('deletes the file when its general facet is not kept', () => {
    const result = transformMdx('A.mdx', code, new Set(['general.general-setup']))
    expect(result.deleteFile).toBe(true)
  })

  it('keeps the file untouched when its general facet is kept', () => {
    const result = transformMdx('A.mdx', code, new Set(['general.general-a11y']))
    expect(result.deleteFile).toBe(false)
    expect(result.changed).toBe(false)
  })
})

describe('starImports', () => {
  it('returns the alias and specifier of every namespace import', () => {
    const code = [
      "import * as SpinnerStories from './Spinner.stories'",
      "import { Meta } from '@storybook/addon-docs/blocks'",
      '',
    ].join('\n')
    expect(starImports(code)).toEqual([{ alias: 'SpinnerStories', specifier: './Spinner.stories' }])
  })

  it('returns an empty list when there are none', () => {
    expect(starImports('# Title\n')).toEqual([])
  })
})
```

The multi-line `<Meta>` case matters: Droppy's docs wrap it across lines, and it works only because the regex's `[^>]*` matches newlines.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/mdx-transform.test.ts`
Expected: FAIL — cannot resolve `./mdx-transform`.

- [ ] **Step 3: Port `mdx-transform.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/mdx-transform.ts`

Copy verbatim, restyled. Keep the `// eslint-disable-next-line no-cond-assign` comment above the `while ((match = beginRe.exec(out)) !== null)` loop — unlike the `no-await-in-loop` pragmas, that rule ships in `js.configs.recommended`, which this repo extends. No behavioural change.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/mdx-transform.test.ts`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/mdx-transform.ts tools/storybook-freeze/src/mdx-transform.test.ts
git commit -m "$(cat <<'EOF'
feat: strip MDX facet blocks and gate whole-file general docs

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: canvas-purge.ts

**Files:**

- Create: `tools/storybook-freeze/src/canvas-purge.ts`
- Test: `tools/storybook-freeze/src/canvas-purge.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `interface CanvasPurgeResult { code: string; changed: boolean }` and `purgeCanvasReferences(code: string, removedRefs: ReadonlySet<string>): CanvasPurgeResult`, where `removedRefs` holds fully-qualified `alias.exportName` strings. Task 11 consumes it.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/canvas-purge.test.ts` — upstream's tests restyled, with a case for the anatomy shape every Droppy component MDX has:

```ts
import { describe, expect, it } from 'vitest'

import { purgeCanvasReferences } from './canvas-purge'

describe('purgeCanvasReferences', () => {
  it('returns the code untouched when nothing was removed', () => {
    const code = '<Canvas of={S.Hero} />\n'
    const result = purgeCanvasReferences(code, new Set())
    expect(result.changed).toBe(false)
    expect(result.code).toBe(code)
  })

  it('removes only the Canvas invocations of removed exports', () => {
    const code = ['<Canvas of={S.Hero} />', '<Canvas of={S.Extra} />', ''].join('\n')
    const result = purgeCanvasReferences(code, new Set(['S.Extra']))
    expect(result.changed).toBe(true)
    expect(result.code).toContain('S.Hero')
    expect(result.code).not.toContain('S.Extra')
  })

  it('drops a subsection heading left with no content', () => {
    const code = [
      '## Showcase',
      '',
      '<Canvas of={S.Hero} />',
      '',
      '### Extra',
      '',
      '<Canvas of={S.Extra} />',
      '',
    ].join('\n')
    const result = purgeCanvasReferences(code, new Set(['S.Extra']))
    expect(result.code).toContain('## Showcase')
    expect(result.code).not.toContain('### Extra')
  })

  it('keeps a heading whose other content survives', () => {
    const code = [
      '## Anatomy',
      '',
      '<Canvas of={S.Anatomy} />',
      '',
      '| Part | Purpose |',
      '| :--- | :------ |',
      '| Root | The wrapper |',
      '',
    ].join('\n')
    const result = purgeCanvasReferences(code, new Set(['S.Anatomy']))
    expect(result.code).toContain('## Anatomy')
    expect(result.code).toContain('| Root | The wrapper |')
    expect(result.code).not.toContain('S.Anatomy')
  })

  it('keeps a parent heading whose child subsection still has content', () => {
    const code = [
      '## Behavior',
      '',
      '<Canvas of={S.Gone} />',
      '',
      '### The motion',
      '',
      'still here',
      '',
    ].join('\n')
    const result = purgeCanvasReferences(code, new Set(['S.Gone']))
    expect(result.code).toContain('## Behavior')
    expect(result.code).toContain('### The motion')
    expect(result.code).toContain('still here')
  })

  it('treats an MDX section delimiter as a boundary, not as content', () => {
    const code = [
      '{/* BEGIN: props */}',
      '',
      '### `label`',
      '',
      '<Canvas of={S.Label} />',
      '{/* END: props */}',
      '',
    ].join('\n')
    const result = purgeCanvasReferences(code, new Set(['S.Label']))
    expect(result.code).not.toContain('### `label`')
    expect(result.code).toContain('BEGIN: props')
  })

  it('collapses the blank lines it leaves behind', () => {
    const code = ['a', '', '<Canvas of={S.Gone} />', '', 'b', ''].join('\n')
    const result = purgeCanvasReferences(code, new Set(['S.Gone']))
    expect(result.code).not.toMatch(/\n{3,}/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/canvas-purge.test.ts`
Expected: FAIL — cannot resolve `./canvas-purge`.

- [ ] **Step 3: Port `canvas-purge.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/canvas-purge.ts`

Copy verbatim, restyled. It drops matching `<Canvas of={Alias.Export} />` lines, then iterates `removeEmptyHeadings` to a fixpoint, where a subsection runs until the next heading of the same or higher level or an MDX comment delimiter, and deeper subheadings count as body content. Finally it collapses runs of three or more newlines.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/canvas-purge.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/canvas-purge.ts tools/storybook-freeze/src/canvas-purge.test.ts
git commit -m "$(cat <<'EOF'
feat: purge Canvas references to removed story exports

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: deadcode.ts

**Files:**

- Create: `tools/storybook-freeze/src/deadcode.ts`
- Test: `tools/storybook-freeze/src/deadcode.test.ts`

**Interfaces:**

- Consumes: `parse`, `leadingBlockComment` from Task 1.
- Produces: `interface TransformResult { code: string; changed: boolean }` and `removeUnusedTopLevel(filename: string, code: string): TransformResult`. Task 13 consumes it.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/deadcode.test.ts` — upstream's tests restyled, with a case built from Droppy's actual story-file helper:

```ts
import { describe, expect, it } from 'vitest'

import { removeUnusedTopLevel } from './deadcode'

describe('removeUnusedTopLevel', () => {
  it('removes an unreferenced non-exported const', () => {
    const code = ['const unused = 1', 'export const used = 2', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.changed).toBe(true)
    expect(result.code).not.toContain('unused')
    expect(result.code).toContain('export const used')
  })

  it('removes an unreferenced non-exported function and its JSDoc', () => {
    const code = ['/** A helper. */', 'function helper() {}', 'export const a = 1', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).not.toContain('helper')
    expect(result.code).not.toContain('A helper.')
  })

  it('keeps a declaration that is still referenced', () => {
    const code = ['const used = 1', 'export const a = used', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.changed).toBe(false)
    expect(result.code).toBe(code)
  })

  it('never removes an exported declaration, referenced or not', () => {
    const code = 'export const orphan = 1\n'
    expect(removeUnusedTopLevel('a.tsx', code).changed).toBe(false)
  })

  it('removes a chain of helpers down to a fixpoint', () => {
    const code = ['const inner = 1', 'const outer = inner + 1', 'export const a = 2', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).not.toContain('inner')
    expect(result.code).not.toContain('outer')
    expect(result.code).toContain('export const a')
  })

  it('keeps a helper referenced only from JSX', () => {
    const code = [
      'const Wrapper = () => null',
      'export const a = { render: () => <Wrapper /> }',
      '',
    ].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).toContain('Wrapper')
  })

  it("drops a story file's hide helper once every story using it is gone", () => {
    const code = [
      'const hide = (...props) => Object.fromEntries(props.map((p) => [p, {}]))',
      'const meta = { title: "Spinner" } satisfies Meta',
      'export default meta',
      '',
    ].join('\n')
    const result = removeUnusedTopLevel('S.stories.tsx', code)
    expect(result.code).not.toContain('const hide')
    expect(result.code).toContain('const meta')
  })

  it('leaves destructuring declarations alone', () => {
    const code = ['const { a, b } = obj', 'export const c = 1', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).toContain('const { a, b }')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/deadcode.test.ts`
Expected: FAIL — cannot resolve `./deadcode`.

- [ ] **Step 3: Port `deadcode.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/deadcode.ts`

Copy verbatim, restyled. It walks the AST counting every `Identifier`/`JSXIdentifier` occurrence, treats a top-level non-exported function or `const`/`let`/`var` as unused when its global occurrence count does not exceed its own subtree count, removes it with any leading block comment and trailing newline, and repeats until a pass removes nothing. Destructuring patterns return `null` from `candidateNames` and are never touched.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/deadcode.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/deadcode.ts tools/storybook-freeze/src/deadcode.test.ts
git commit -m "$(cat <<'EOF'
feat: remove top-level declarations orphaned by stripped stories

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: biome.ts and format.ts

Two one-function cleanup passes that always run together, right after the transforms.

**Files:**

- Create: `tools/storybook-freeze/src/biome.ts`
- Create: `tools/storybook-freeze/src/format.ts`
- Test: `tools/storybook-freeze/src/biome.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `removeUnusedImports(files: string[], cwd: string): void` (synchronous — it shells out with `execFileSync`) and `formatFiles(files: string[]): Promise<void>`. Task 13 consumes both.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/biome.test.ts` — upstream's test restyled:

```ts
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { removeUnusedImports } from './biome'

let dir: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-biome-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('removeUnusedImports', () => {
  it('removes an unused named import and keeps the used one', async () => {
    const file = path.join(dir, 'a.tsx')
    await writeFile(
      file,
      ['import { Used, Unused } from "./m";', 'export const a = Used;', ''].join('\n')
    )
    removeUnusedImports([file], dir)
    const code = await readFile(file, 'utf8')
    expect(code).toContain('Used')
    expect(code).not.toContain('Unused')
  })

  it('removes an import statement left with nothing used', async () => {
    const file = path.join(dir, 'b.tsx')
    await writeFile(file, ['import { Gone } from "./m";', 'export const b = 1;', ''].join('\n'))
    removeUnusedImports([file], dir)
    const code = await readFile(file, 'utf8')
    expect(code).not.toContain('./m')
    expect(code).toContain('export const b')
  })

  it('does nothing when given no files', () => {
    expect(() => removeUnusedImports([], dir)).not.toThrow()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/biome.test.ts`
Expected: FAIL — cannot resolve `./biome`.

- [ ] **Step 3: Port both files**

Read upstream:

```bash
git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/biome.ts
git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/format.ts
```

Copy both verbatim, restyled. `biome.ts` resolves `@biomejs/biome/bin/biome` through `createRequire`, then `execFileSync(process.execPath, [biomeBin, 'lint', '--write', '--unsafe', '--only=correctness/noUnusedImports', ...files], { cwd, stdio: 'ignore' })`. Keep the comment explaining why `--unsafe` is required: Biome classifies the fix for a named import as unsafe, and `--only` is what keeps the run from touching anything else. Do not add a `biome.json` — the single-rule scope is precisely what makes running Biome in an ESLint repo safe.

`format.ts` resolves Prettier's config per file, skips ignored files and files with no inferred parser, and formats the rest.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/biome.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/biome.ts tools/storybook-freeze/src/format.ts tools/storybook-freeze/src/biome.test.ts
git commit -m "$(cat <<'EOF'
feat: add the unused-import and formatting passes

Biome runs with --only=correctness/noUnusedImports and no config file, so
it touches nothing but the imports the story stripping orphaned and never
competes with ESLint or Prettier.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: corpus.ts — the Droppy globs

**Files:**

- Create: `tools/storybook-freeze/src/corpus.ts`
- Test: `tools/storybook-freeze/src/corpus.test.ts`

**Interfaces:**

- Consumes: `transformStory` (Task 6), `transformSource` (Task 5), `transformMdx`/`starImports` (Task 7), `purgeCanvasReferences` (Task 8), `Labels` (Task 2).
- Produces: `interface CorpusSummary { written: string[]; removed: string[]; storiesRemoved: number }` and `runCorpus(cwd: string, keep: ReadonlySet<string>, labels: Labels): Promise<CorpusSummary>`. Task 13 consumes it. Paths in `written` and `removed` are absolute.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/corpus.test.ts` — upstream's three suites with every path rewritten for Droppy's layout. Note that in Droppy the story, doc and source of a component all live in the same directory, unlike base-ui where they are in different packages:

```ts
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { runCorpus } from './corpus'
import { type Labels } from './labels'

const labels: Labels = {
  definedFacets: [],
  deleteFacets: new Set(['story.infra']),
  storyTags: new Set(['showcase', 'highlight', 'infra']),
  isKept: (f, keep) => f !== 'story.infra' && keep.has(f),
}

const storyFile = (exports: string[]): string =>
  [
    'const meta = { title: "X" } satisfies Meta',
    'export default meta',
    'type Story = StoryObj<typeof meta>',
    ...exports,
    '',
  ].join('\n')

let dir: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-corpus-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

/** Create `src/components/<name>/` under the temp repo and return its absolute path. */
async function component(root: string, name: string): Promise<string> {
  const dirPath = path.join(root, 'src/components', name)
  await mkdir(dirPath, { recursive: true })
  return dirPath
}

describe('runCorpus', () => {
  it('drops unkept stories, prunes emptied files, strips mdx blocks and source jsdoc', async () => {
    const checkbox = await component(dir, 'Checkbox')
    const gallery = await component(dir, 'Gallery')

    await writeFile(
      path.join(checkbox, 'Checkbox.stories.tsx'),
      storyFile([
        "export const Hero: Story = { tags: ['showcase'], render: () => null }",
        "export const Grid: Story = { tags: ['infra'], render: () => null }",
      ])
    )
    await writeFile(
      path.join(gallery, 'Gallery.stories.tsx'),
      storyFile(["export const Only: Story = { tags: ['infra'], render: () => null }"])
    )
    await writeFile(
      path.join(checkbox, 'Checkbox.mdx'),
      [
        '{/* BEGIN: general */}',
        'keep me',
        '{/* END: general */}',
        '',
        '{/* BEGIN: styling */}',
        'drop me',
        '{/* END: styling */}',
        '',
      ].join('\n')
    )
    await writeFile(
      path.join(checkbox, 'Checkbox.tsx'),
      ['/** desc */', 'export const Checkbox = () => null', ''].join('\n')
    )

    const summary = await runCorpus(dir, new Set(['mdx.general']), labels)

    // Both story files lose every export, so both are deleted.
    await expect(access(path.join(checkbox, 'Checkbox.stories.tsx'))).rejects.toThrow()
    await expect(access(path.join(gallery, 'Gallery.stories.tsx'))).rejects.toThrow()

    // The doc has no namespace import, so nothing makes it dangle.
    const mdx = await readFile(path.join(checkbox, 'Checkbox.mdx'), 'utf8')
    expect(mdx).toContain('keep me')
    expect(mdx).not.toContain('drop me')

    const source = await readFile(path.join(checkbox, 'Checkbox.tsx'), 'utf8')
    expect(source).not.toContain('desc')

    expect(summary.storiesRemoved).toBe(3)
    expect(summary.removed).toHaveLength(2)
  })

  it('deletes MDX star-importing a pruned CSF and keeps MDX importing a surviving one', async () => {
    const button = await component(dir, 'Button')
    const radio = await component(dir, 'Radio')

    await writeFile(
      path.join(button, 'Button.stories.tsx'),
      storyFile(["export const Hero: Story = { tags: ['showcase'], render: () => null }"])
    )
    await writeFile(
      path.join(button, 'Button.mdx'),
      [
        "import * as ButtonStories from './Button.stories'",
        '',
        '<Meta of={ButtonStories} />',
        '',
      ].join('\n')
    )
    await writeFile(
      path.join(radio, 'Radio.stories.tsx'),
      storyFile(["export const Only: Story = { tags: ['infra'], render: () => null }"])
    )
    await writeFile(
      path.join(radio, 'Radio.mdx'),
      [
        "import * as RadioStories from './Radio.stories'",
        '',
        '<Meta of={RadioStories} />',
        '',
      ].join('\n')
    )

    await runCorpus(dir, new Set(['story.showcase']), labels)

    await expect(access(path.join(button, 'Button.stories.tsx'))).resolves.toBeUndefined()
    await expect(access(path.join(button, 'Button.mdx'))).resolves.toBeUndefined()
    await expect(access(path.join(radio, 'Radio.stories.tsx'))).rejects.toThrow()
    await expect(access(path.join(radio, 'Radio.mdx'))).rejects.toThrow()
  })

  it('purges Canvas invocations of removed exports in a surviving sibling doc', async () => {
    const button = await component(dir, 'Button')

    await writeFile(
      path.join(button, 'Button.stories.tsx'),
      storyFile([
        "export const Hero: Story = { tags: ['showcase'], render: () => null }",
        "export const Extra: Story = { tags: ['highlight'], render: () => null }",
      ])
    )
    await writeFile(
      path.join(button, 'Button.mdx'),
      [
        "import * as ButtonStories from './Button.stories'",
        '',
        '<Meta of={ButtonStories} />',
        '',
        '## Showcase',
        '',
        '<Canvas of={ButtonStories.Hero} />',
        '',
        '### Extra',
        '',
        '<Canvas of={ButtonStories.Extra} />',
        '',
      ].join('\n')
    )

    await runCorpus(dir, new Set(['story.showcase']), labels)

    const mdx = await readFile(path.join(button, 'Button.mdx'), 'utf8')
    expect(mdx).toContain('ButtonStories.Hero')
    expect(mdx).not.toContain('ButtonStories.Extra')
    expect(mdx).not.toContain('### Extra')
    expect(mdx).toContain('## Showcase')
  })

  it('deletes a whole-file general doc whose facet is not kept', async () => {
    const docs = path.join(dir, 'src/docs')
    await mkdir(docs, { recursive: true })
    await writeFile(
      path.join(docs, 'AccessibilityGuidelines.mdx'),
      ['<Meta', '  title="Accessibility guidelines"', "  tags={['general-a11y']}", '/>', ''].join(
        '\n'
      )
    )
    await writeFile(
      path.join(docs, 'GettingStarted.mdx'),
      ['<Meta title="Getting started" tags={[\'general-setup\']} />', ''].join('\n')
    )

    const summary = await runCorpus(dir, new Set(['general.general-setup']), labels)

    await expect(access(path.join(docs, 'AccessibilityGuidelines.mdx'))).rejects.toThrow()
    await expect(access(path.join(docs, 'GettingStarted.mdx'))).resolves.toBeUndefined()
    expect(summary.removed).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/corpus.test.ts`
Expected: FAIL — cannot resolve `./corpus`.

- [ ] **Step 3: Port `corpus.ts` with Droppy's globs**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/corpus.ts`

Copy verbatim, restyled, changing only the three globs in `runCorpus`:

```ts
const [storyFiles, mdxFiles, sourceFiles] = await Promise.all([
  globby('src/components/*/*.stories.tsx', { cwd, absolute: true }),
  globby(['src/components/*/*.mdx', 'src/docs/*.mdx'], { cwd, absolute: true }),
  globby(['src/components/**/*.tsx', '!**/*.test.tsx', '!**/*.stories.tsx'], {
    cwd,
    absolute: true,
  }),
])
```

Everything else is unchanged, including the ordering comment explaining why source files run concurrently while MDX waits on the story results — it needs `prunedCsf` and `removedExportsByCsf` to know which docs dangle and which `<Canvas>` calls to purge.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/corpus.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/corpus.ts tools/storybook-freeze/src/corpus.test.ts
git commit -m "$(cat <<'EOF'
feat: walk the corpus over Droppy's flat component layout

Stories, docs and source share one directory per component here, rather
than living in separate packages as they do upstream.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: git.ts

**Files:**

- Create: `tools/storybook-freeze/src/git.ts`
- Test: `tools/storybook-freeze/src/git.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces, all taking a `SimpleGit` except the factory: `createGit(cwd: string): SimpleGit`, `assertClean(git): Promise<void>`, `headSha(git): Promise<string>`, `localBranches(git): Promise<string[]>`, `localBranchShas(git): Promise<Map<string, string>>`, `remoteBranchShas(git, remote: string): Promise<Map<string, string>>`, `remoteBranchSha(git, remote, branch): Promise<string | undefined>`, `remoteUrl(git, remote): Promise<string | undefined>`, `currentRef(git): Promise<string>`, `checkoutRef(git, ref): Promise<void>`, `resetBranchToHead(git, branch): Promise<void>`, `commitAll(git, message): Promise<void>`, `forcePushBranch(git, remote, branch): Promise<void>`. Tasks 13, 14 and 16 consume these.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/git.test.ts` — ported from upstream, restyled. It builds a real repo in a temp dir; nothing touches a remote.

```ts
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  assertClean,
  commitAll,
  createGit,
  currentRef,
  headSha,
  localBranchShas,
  localBranches,
  remoteUrl,
  resetBranchToHead,
} from './git'

let dir: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-git-'))
  const git = createGit(dir)
  await git.init()
  await git.addConfig('user.email', 'test@example.com')
  await git.addConfig('user.name', 'Test')
  await writeFile(path.join(dir, 'a.txt'), 'a\n')
  await git.add(['-A'])
  await git.commit('initial')
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('assertClean', () => {
  it('resolves on a clean tree', async () => {
    await expect(assertClean(createGit(dir))).resolves.toBeUndefined()
  })

  it('throws a Droppy error on a dirty tree', async () => {
    await writeFile(path.join(dir, 'dirty.txt'), 'x\n')
    await expect(assertClean(createGit(dir))).rejects.toThrow(/clean working tree/)
  })
})

describe('headSha and localBranchShas', () => {
  it('agree on where the current branch points', async () => {
    const git = createGit(dir)
    const head = await headSha(git)
    const branch = await currentRef(git)
    expect((await localBranchShas(git)).get(branch)).toBe(head)
  })
})

describe('resetBranchToHead', () => {
  it('creates a branch at HEAD and lists it', async () => {
    const git = createGit(dir)
    await resetBranchToHead(git, 'experiment/x')
    expect(await localBranches(git)).toContain('experiment/x')
    expect(await currentRef(git)).toBe('experiment/x')
  })
})

describe('commitAll', () => {
  it('stages everything and commits, leaving the tree clean', async () => {
    const git = createGit(dir)
    const before = await headSha(git)
    await writeFile(path.join(dir, 'b.txt'), 'b\n')
    await commitAll(git, 'second')
    expect(await headSha(git)).not.toBe(before)
    await expect(assertClean(git)).resolves.toBeUndefined()
  })
})

describe('remoteUrl', () => {
  it('returns undefined when the remote does not exist', async () => {
    expect(await remoteUrl(createGit(dir), 'origin')).toBeUndefined()
  })

  it('returns the configured url', async () => {
    const git = createGit(dir)
    await git.addRemote('origin', 'git@example.com:acme/repo.git')
    expect(await remoteUrl(git, 'origin')).toBe('git@example.com:acme/repo.git')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/git.test.ts`
Expected: FAIL — cannot resolve `./git`.

- [ ] **Step 3: Port `git.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/git.ts`

Copy verbatim, restyled, with `Base UI:` → `Droppy:` in the `assertClean` message. Keep the comments explaining that `remoteBranchShas` uses `ls-remote` so no objects are fetched, and that `forcePushBranch` pushes `branch:branch` without checking the branch out because frozen branches never fast-forward.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/git.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/git.ts tools/storybook-freeze/src/git.test.ts
git commit -m "$(cat <<'EOF'
feat: add the git wrappers the freeze and publish flows share

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: freeze.ts

**Files:**

- Create: `tools/storybook-freeze/src/freeze.ts`
- Test: `tools/storybook-freeze/src/freeze.test.ts`

**Interfaces:**

- Consumes: everything from Tasks 2, 4, 9, 10, 11, 12.
- Produces: `interface BranchResult { branch: string; summary: CorpusSummary }`, `buildExperimentBranch(opts): Promise<BranchResult>`, and

```ts
regenerateExperiments(opts: {
  cwd: string
  experiments: ExperimentConfig[]
  labels: Labels
  now: string
  version: number
}): Promise<BranchResult[]>
```

Task 14 consumes `regenerateExperiments`. **`version` is a `number`**, matching `manifest.ts` from Task 4.

- [ ] **Step 1: Write the failing test**

`tools/storybook-freeze/src/freeze.test.ts` — ported from upstream with the fixture paths moved to `src/components/Checkbox/` and one correction: upstream's test passes `version: '0.1.0'`, a string, into a parameter typed `number`. That only survives upstream because vitest does not type-check. Use `version: 1`, matching what `cli.ts` passes.

```ts
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { simpleGit } from 'simple-git'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { regenerateExperiments } from './freeze'
import { type Labels } from './labels'

const labels: Labels = {
  definedFacets: ['story.showcase', 'story.api-ref'],
  deleteFacets: new Set(['story.infra']),
  storyTags: new Set(['showcase', 'api-ref', 'infra']),
  isKept: (f, keep) => f !== 'story.infra' && keep.has(f),
}

const experiments = [
  { branchName: 'experiment/showcase', facets: ['story.showcase'] },
  { branchName: 'experiment/apiref', facets: ['story.api-ref'] },
]

const STORY_PATH = 'src/components/Checkbox/Checkbox.stories.tsx'

let dir: string
let base: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-regen-'))
  await mkdir(path.join(dir, 'src/components/Checkbox'), { recursive: true })
  await writeFile(
    path.join(dir, STORY_PATH),
    [
      'const meta = { title: "Checkbox" } satisfies Meta',
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      "export const Hero: Story = { tags: ['showcase'], render: () => null }",
      "export const Details: Story = { tags: ['api-ref'], render: () => null }",
      '',
    ].join('\n')
  )
  const git = simpleGit(dir)
  await git.init()
  await git.addConfig('user.email', 'test@example.com')
  await git.addConfig('user.name', 'Test')
  await git.add(['-A'])
  await git.commit('initial')
  base = (await git.revparse(['--abbrev-ref', 'HEAD'])).trim()
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

const run = (now = '2026-08-13T00:00:00.000Z') =>
  regenerateExperiments({ cwd: dir, experiments, labels, now, version: 1 })

describe('regenerateExperiments', () => {
  it('builds one branch per entry from the same base and returns to it', async () => {
    const results = await run()
    expect(results.map((r) => r.branch)).toEqual(['experiment/showcase', 'experiment/apiref'])

    const git = simpleGit(dir)
    expect((await git.status()).current).toBe(base)
    const branches = (await git.branchLocal()).all
    expect(branches).toContain('experiment/showcase')
    expect(branches).toContain('experiment/apiref')

    await git.checkout('experiment/showcase')
    const showcase = await readFile(path.join(dir, STORY_PATH), 'utf8')
    expect(showcase).toContain('export const Hero')
    expect(showcase).not.toContain('export const Details')

    await git.checkout('experiment/apiref')
    const apiref = await readFile(path.join(dir, STORY_PATH), 'utf8')
    expect(apiref).toContain('export const Details')
    expect(apiref).not.toContain('export const Hero')
  })

  it('commits a manifest describing the branch', async () => {
    await run()
    const git = simpleGit(dir)
    await git.checkout('experiment/showcase')
    const manifest = JSON.parse(await readFile(path.join(dir, 'experiment.json'), 'utf8'))
    expect(manifest.branchName).toBe('experiment/showcase')
    expect(manifest.keptFacets).toEqual(['story.showcase'])
    expect(manifest.version).toBe(1)
    expect(manifest.baseCommit).toHaveLength(40)
  })

  it('leaves each generated branch with a clean tree', async () => {
    await run()
    const git = simpleGit(dir)
    await git.checkout('experiment/showcase')
    expect((await git.status()).isClean()).toBe(true)
  })

  it('overwrites an existing target branch on a second run', async () => {
    await run()
    const results = await run('2026-08-14T00:00:00.000Z')
    expect(results).toHaveLength(2)
    expect((await simpleGit(dir).status()).current).toBe(base)
  })

  it('refuses to run on a dirty tree', async () => {
    await writeFile(path.join(dir, 'dirty.txt'), 'x\n')
    await expect(run()).rejects.toThrow(/clean working tree/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm experiment:test src/freeze.test.ts`
Expected: FAIL — cannot resolve `./freeze`.

- [ ] **Step 3: Port `freeze.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/freeze.ts`

Copy verbatim, restyled, dropping the `no-await-in-loop` pragmas but keeping the comment that says branches share one working tree so they must be built one at a time. `buildExperimentBranch` checks out the base ref, resets the branch to HEAD, runs the corpus, purges dead code, formats, writes the manifest, and commits `[storybook-freeze] Freeze <branch>`. `regenerateExperiments` asserts a clean tree, records the base ref and commit, loops, and checks the base ref back out.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/freeze.test.ts`
Expected: PASS, 5 tests. These are the first tests that exercise Biome and Prettier end to end — the temp repo has no `biome.json` and no `.prettierrc`, so both fall back to defaults, which is fine because the assertions are about which exports survive, not formatting.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/freeze.ts tools/storybook-freeze/src/freeze.test.ts
git commit -m "$(cat <<'EOF'
feat: build one experiment branch per config entry

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: cli.ts

**Files:**

- Create: `tools/storybook-freeze/src/cli.ts`

**Interfaces:**

- Consumes: `loadLabels` (Task 2), `loadExperiments`/`validateExperiments` (Task 3), `createGit`/`assertClean`/`localBranches` (Task 12), `regenerateExperiments` (Task 13).
- Produces: the `pnpm experiment:freeze` entry point. Nothing imports it.

No unit test: it is an interactive shell over `regenerateExperiments`, which Task 13 already covers. Verification is running it.

- [ ] **Step 1: Port `cli.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/cli.ts`

Copy verbatim, restyled, with three changes:

```ts
const REPO_ROOT = path.resolve(fileURLToPath(import.meta.url), '../../../..')
const LABELS_PATH = path.join(REPO_ROOT, 'classification-labels.jsonc')
const VERSION = 1
```

The `'../../../..'` literal is unchanged: `tools/storybook-freeze/src/` sits at the same depth as upstream's `packages/storybook-freeze/src/`. The labels path loses base-ui's `apps/storybook/` prefix. Everything else — the `@clack/prompts` intro, listing existing branches, confirming collisions before overwriting, the spinner, and the per-branch summary outro — is unchanged, except that the `experiments.config.ts is empty` cancel message needs no `apps/` path fix.

- [ ] **Step 2: Verify it refuses to run on a dirty tree**

Run:

```bash
touch scratch-dirty.txt && pnpm experiment:freeze; rm -f scratch-dirty.txt
```

Expected: it prints the existing branches, then fails with the clean-working-tree error, and exits non-zero. It must not create any branch. Confirm with `git branch --list 'experiment/*'` — expected: empty.

- [ ] **Step 3: Verify the config and taxonomy load**

With a clean tree, run `pnpm experiment:freeze` and **answer "no"** at the overwrite confirmation, or press Ctrl-C at the prompt.

Expected: it prints `Existing branches:` with a bulleted list and reaches the confirmation without a validation error. Reaching that prompt proves `classification-labels.jsonc` parsed, all 17 entries validated, and the tree was clean.

Do **not** let it complete. A full run would create 17 local branches from a `main` that has no story tags or MDX markers, producing 17 near-identical branches; the real first freeze belongs on the classification branch and is out of scope here. If it does complete, delete them: `git branch --list 'experiment/*' | xargs -r git branch -D`.

- [ ] **Step 4: Commit**

```bash
git add tools/storybook-freeze/src/cli.ts
git commit -m "$(cat <<'EOF'
feat: add the experiment:freeze CLI entry point

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: publish-plan.ts and push-retry.ts

Two pure modules with no I/O, both consumed only by Task 16.

**Files:**

- Create: `tools/storybook-freeze/src/publish-plan.ts`
- Create: `tools/storybook-freeze/src/push-retry.ts`
- Test: `tools/storybook-freeze/src/publish-plan.test.ts`
- Test: `tools/storybook-freeze/src/push-retry.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `interface PushPlan { push: string[]; upToDate: string[]; missing: string[]; stray: string[] }`, `planBranchPush(input: PushPlanInput): PushPlan` where `PushPlanInput` is `{ configBranches: string[]; localShas: ReadonlyMap<string, string>; remoteShas?: ReadonlyMap<string, string> | undefined; force?: boolean | undefined }`; and `isTransientPushError(message: string): boolean`, `retryDelayMs(attempt: number): number`, `pushWithRetry(options: PushWithRetryOptions): Promise<PushOutcome>` with `PushOutcome` being `{ attempts: number; landedDespiteError: boolean }`.

- [ ] **Step 1: Write the failing tests**

`tools/storybook-freeze/src/publish-plan.test.ts` — upstream's tests restyled:

```ts
import { describe, expect, it } from 'vitest'

import { planBranchPush } from './publish-plan'

const config = ['experiment/a', 'experiment/b']

describe('planBranchPush', () => {
  it('pushes a configured branch that differs from the remote', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: new Map([['experiment/a', 'old']]),
    })
    expect(plan.push).toEqual(['experiment/a', 'experiment/b'])
    expect(plan.upToDate).toEqual([])
  })

  it('skips a branch the remote already matches', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'old'],
      ]),
    })
    expect(plan.push).toEqual(['experiment/b'])
    expect(plan.upToDate).toEqual(['experiment/a'])
  })

  it('pushes an up-to-date branch anyway under force', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      force: true,
    })
    expect(plan.push).toEqual(config)
    expect(plan.upToDate).toEqual([])
  })

  it('pushes everything when the remote could not be read', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: undefined,
    })
    expect(plan.push).toEqual(config)
  })

  it('reports a configured branch with no local branch as missing', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([['experiment/a', 'aaa']]),
      remoteShas: new Map(),
    })
    expect(plan.push).toEqual(['experiment/a'])
    expect(plan.missing).toEqual(['experiment/b'])
  })

  it('reports a local experiment branch absent from the config as stray', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
        ['experiment/retired', 'ccc'],
        ['main', 'ddd'],
      ]),
      remoteShas: new Map(),
    })
    expect(plan.stray).toEqual(['experiment/retired'])
    expect(plan.push).not.toContain('experiment/retired')
    expect(plan.stray).not.toContain('main')
  })
})
```

`tools/storybook-freeze/src/push-retry.test.ts` — upstream's tests restyled:

```ts
import { describe, expect, it, vi } from 'vitest'

import { isTransientPushError, pushWithRetry, retryDelayMs } from './push-retry'

const noSleep = async (): Promise<void> => undefined

describe('isTransientPushError', () => {
  it('recognises the network and server failures worth retrying', () => {
    expect(isTransientPushError('RPC failed; HTTP 502 curl 22')).toBe(true)
    expect(isTransientPushError('the remote end hung up unexpectedly')).toBe(true)
    expect(isTransientPushError('early EOF')).toBe(true)
    expect(isTransientPushError('Connection reset by peer')).toBe(true)
  })

  it('does not recognise a real rejection', () => {
    expect(isTransientPushError('Permission denied (publickey)')).toBe(false)
    expect(isTransientPushError('! [rejected] experiment/a -> experiment/a')).toBe(false)
  })
})

describe('retryDelayMs', () => {
  it('backs off exponentially and caps at a minute', () => {
    expect(retryDelayMs(1)).toBe(3000)
    expect(retryDelayMs(2)).toBe(9000)
    expect(retryDelayMs(3)).toBe(27_000)
    expect(retryDelayMs(9)).toBe(60_000)
  })
})

describe('pushWithRetry', () => {
  it('reports a single attempt when the push succeeds', async () => {
    const push = vi.fn(async () => undefined)
    const outcome = await pushWithRetry({ attempts: 3, push, sleep: noSleep })
    expect(outcome).toEqual({ attempts: 1, landedDespiteError: false })
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('retries a transient failure and reports the attempt count', async () => {
    const push = vi
      .fn()
      .mockRejectedValueOnce(new Error('RPC failed; HTTP 502'))
      .mockResolvedValueOnce(undefined)
    const outcome = await pushWithRetry({ attempts: 3, push, sleep: noSleep })
    expect(outcome.attempts).toBe(2)
    expect(push).toHaveBeenCalledTimes(2)
  })

  it('rethrows a non-transient failure without retrying', async () => {
    const push = vi.fn().mockRejectedValue(new Error('Permission denied (publickey)'))
    await expect(pushWithRetry({ attempts: 3, push, sleep: noSleep })).rejects.toThrow(
      /Permission denied/
    )
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('rethrows once the attempts are exhausted', async () => {
    const push = vi.fn().mockRejectedValue(new Error('early EOF'))
    await expect(pushWithRetry({ attempts: 2, push, sleep: noSleep })).rejects.toThrow(/early EOF/)
    expect(push).toHaveBeenCalledTimes(2)
  })

  it('treats a verified ref as landed even though the push reported an error', async () => {
    const push = vi.fn().mockRejectedValue(new Error('early EOF'))
    const outcome = await pushWithRetry({
      attempts: 3,
      push,
      verify: async () => true,
      sleep: noSleep,
    })
    expect(outcome).toEqual({ attempts: 1, landedDespiteError: true })
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('does not let a throwing verify mask the push error', async () => {
    const push = vi.fn().mockRejectedValue(new Error('Permission denied (publickey)'))
    await expect(
      pushWithRetry({
        attempts: 2,
        push,
        verify: async () => {
          throw new Error('ls-remote failed')
        },
        sleep: noSleep,
      })
    ).rejects.toThrow(/Permission denied/)
  })

  it('reports each retry to the caller', async () => {
    const push = vi
      .fn()
      .mockRejectedValueOnce(new Error('early EOF'))
      .mockResolvedValueOnce(undefined)
    const onRetry = vi.fn()
    await pushWithRetry({ attempts: 3, push, onRetry, sleep: noSleep })
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onRetry.mock.calls[0][0]).toMatchObject({ attempt: 1, attempts: 3, delayMs: 3000 })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm experiment:test src/publish-plan.test.ts src/push-retry.test.ts`
Expected: FAIL — neither module resolves.

- [ ] **Step 3: Port both files**

Read upstream:

```bash
git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/publish-plan.ts
git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/push-retry.ts
```

Copy both verbatim, restyled, dropping `push-retry.ts`'s `no-await-in-loop` pragmas. Keep both docblocks: `publish-plan.ts`'s explains what each of the four buckets means and why an up-to-date branch is skipped (the push is a no-op that still costs a CI run), and `push-retry.ts`'s explains that force-pushing many branches back to back is what makes GitHub answer with a 5xx, and that the `TRANSIENT_PATTERNS` list exists to separate those from real rejections.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm experiment:test src/publish-plan.test.ts src/push-retry.test.ts`
Expected: PASS, 6 + 8 = 14 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/storybook-freeze/src/publish-plan.ts tools/storybook-freeze/src/push-retry.ts tools/storybook-freeze/src/publish-plan.test.ts tools/storybook-freeze/src/push-retry.test.ts
git commit -m "$(cat <<'EOF'
feat: plan branch pushes and retry transient push failures

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: publish-branches.ts

**Files:**

- Create: `tools/storybook-freeze/src/publish-branches.ts`

**Interfaces:**

- Consumes: `loadLabels` (Task 2), `loadExperiments`/`validateExperiments` (Task 3), `createGit`/`forcePushBranch`/`localBranchShas`/`remoteBranchSha`/`remoteBranchShas`/`remoteUrl` (Task 12), `planBranchPush` (Task 15), `pushWithRetry`/`PushOutcome` (Task 15).
- Produces: the `pnpm experiment:publish-branches` entry point. Nothing imports it.

No unit test: the planning and retry logic it composes are covered by Task 15, and the rest is prompts and progress output.

- [ ] **Step 1: Port `publish-branches.ts`**

Read upstream: `git -C /home/steve/Development/base-ui show origin/research:packages/storybook-freeze/src/publish-branches.ts`

Copy verbatim, restyled, dropping the `no-await-in-loop` pragmas but keeping the comment explaining that the loop is sequential on purpose so per-branch progress stays readable and one failure does not stop the rest. Four changes:

1. `const LABELS_PATH = path.join(REPO_ROOT, 'classification-labels.jsonc')` — no `apps/storybook/` prefix.
2. The header docblock: replace the base-ui text with

```ts
/**
 * Force-push the locally regenerated `experiment/*` branches to origin
 * (`pnpm experiment:publish-branches`). Each push triggers the Experiment preview workflow,
 * which builds that branch and publishes its @droppy/design-system package to pkg.pr.new.
 *
 * Branches whose remote ref already points at the local commit are skipped, so re-running
 * after a partial failure only pushes what is actually missing.
 */
```

3. The two references to `pnpm storybook:freeze` / `pnpm experiment:freeze` in the warning and cancel messages must both read `pnpm experiment:freeze`, matching the script added in Task 1. Upstream is inconsistent between its own two names; pick the real one.
4. The outro: replace the base-ui MCP sentence with

```ts
p.outro(
  `Pushed ${pushed.length} branch(es). Each push triggers the "Experiment preview" workflow, ` +
    "which publishes that branch's @droppy/design-system build to pkg.pr.new."
)
```

- [ ] **Step 2: Verify it reports nothing to push**

Run: `pnpm experiment:publish-branches`

Expected: it reads `origin` refs, warns that all 17 configured branches have no local branch, listing them, and exits non-zero with `No configured experiment branches exist locally — run \`pnpm experiment:freeze\` first.`It must not push anything. This exercises config loading,`ls-remote`, and the planner against the real repo.

- [ ] **Step 3: Verify types and lint across the whole tool**

Run: `pnpm experiment:check` — expected: exit 0.
Run: `pnpm experiment:test` — expected: PASS, all suites.
Run: `pnpm lint` — expected: no errors.
Run: `pnpm format:check` — expected: clean. If not, `pnpm format`.

- [ ] **Step 4: Commit**

```bash
git add tools/storybook-freeze/src/publish-branches.ts
git commit -m "$(cat <<'EOF'
feat: add the experiment:publish-branches entry point

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: the pkg.pr.new workflow, and final verification

**Files:**

- Create: `.github/workflows/experiment-preview.yml`
- Modify: `README.md` (one section)

**Interfaces:**

- Consumes: the `experiment/**` branches Task 14 produces and Task 16 pushes.
- Produces: nothing importable.

- [ ] **Step 1: Create the workflow**

`.github/workflows/experiment-preview.yml`. It follows `preview-release.yml`'s conventions — unpinned `@v4` actions, `pnpm install --frozen-lockfile`, `pnpm build` — rather than base-ui's SHA-pinned style, so the two workflows in this repo stay consistent with each other:

````yaml
name: Experiment preview

# Publishes an installable build of every experiment/* branch through pkg.pr.new, so an
# agentic reference experiment can install one facet selection and measure what it is worth.
# The stripped source JSDoc lands in dist/index.d.ts, so the branches genuinely differ in
# what a consumer sees.
#
# Branches are generated by `pnpm experiment:freeze` and pushed by
# `pnpm experiment:publish-branches`.

on:
  push:
    branches: ['experiment/**']
  workflow_dispatch:

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      # --comment=off because an experiment branch push has no pull request to comment on.
      - run: pnpx pkg-pr-new publish --compact --pnpm --comment=off

      - name: Record the install URLs
        run: |
          {
            echo "### Experiment preview install URLs"
            echo ""
            echo '```'
            echo "https://pkg.pr.new/${GITHUB_REPOSITORY}/@droppy/design-system@${GITHUB_SHA}"
            echo "https://pkg.pr.new/${GITHUB_REPOSITORY}/@droppy/design-system@${GITHUB_REF_NAME}"
            echo '```'
          } >> "$GITHUB_STEP_SUMMARY"
````

`preview-release.yml` is left exactly as it is and keeps serving `main` and pull requests.

- [ ] **Step 2: Validate the workflow parses**

Run:

```bash
pnpm exec prettier --check .github/workflows/experiment-preview.yml
```

Expected: no complaint. If Prettier reformats it, accept the result.

Then confirm GitHub accepts it, if `gh` is authenticated:

```bash
gh workflow list 2>/dev/null || echo "gh not authenticated — skip"
```

This is informational only; the workflow cannot run until the branch is pushed.

- [ ] **Step 3: Document the two commands**

Add a section to `README.md`, after the existing sections and matching their voice. Do not restructure anything else in the file. The block below is the literal Markdown to add — note it contains fenced code blocks of its own:

````markdown
## Experiment branches

`experiment/*` branches each hold one subset of the Storybook corpus, for measuring what a given
kind of documentation is worth to an agent.

```bash
pnpm experiment:freeze             # regenerate every branch in experiments.config.ts
pnpm experiment:publish-branches   # force-push them to origin
```

Facets are the qualified `category.leaf` labels in `classification-labels.jsonc`; each branch's
selection lives in `experiments.config.ts` and is recorded in the `experiment.json` the freeze
commits. Freezing reads the classification on the branch you run it from — story `tags`, MDX
`{/* BEGIN: facet */}` markers, and the `<Meta tags>` on the repo-wide docs — so run it from a
branch where that classification is in place.

Each pushed branch triggers the Experiment preview workflow, which publishes its build to
pkg.pr.new:

```
https://pkg.pr.new/yannbf/droppy-ds/@droppy/design-system@experiment/<name>
```
````

- [ ] **Step 4: Keep Prettier out of the SDD scratch directory**

Add one line to `.prettierignore`:

```
.superpowers
```

That directory holds git-ignored review artifacts. Without this, every one of them shows up as a `format:check` failure.

- [ ] **Step 5: Run the full verification suite**

```bash
pnpm experiment:check
pnpm experiment:test
pnpm check
pnpm lint
pnpm build
```

Expected: all five succeed. `pnpm check` and `pnpm build` prove the tool has not disturbed the library build — they are the reason `tools/` got its own tsconfig rather than joining the root's `include`.

Then the formatting gate, scoped to what this branch added:

```bash
pnpm exec prettier --check 'tools/**/*.{ts,json}' classification-labels.jsonc experiments.config.ts \
  .github/workflows/experiment-preview.yml README.md docs/superpowers
```

Expected: clean. **Do not run a repo-wide `pnpm format:check` and expect it to pass.** Six files fail it on `main` already — `.storybook/preview-head.html`, `.storybook/preview.tsx`, and four `src/docs/*.mdx` — and `src/` is off-limits to this work, so fixing them is not this branch's job. Reformatting them to make the gate green would collide with the parallel classification sessions.

Report the actual output of each command. If any fails, fix it before committing; do not report the task complete with a failing command.

- [ ] **Step 6: Confirm nothing under `src/` was touched**

```bash
git diff --stat main...HEAD -- src/
```

Expected: no output. Any output is a bug in the implementation — revert those files. `src/` belongs to the parallel classification sessions.

- [ ] **Step 7: Commit**

```bash
git add .github/workflows/experiment-preview.yml README.md .prettierignore
git commit -m "$(cat <<'EOF'
feat: publish experiment branches to pkg.pr.new

Every experiment/* push builds and publishes @droppy/design-system, whose
dist/index.d.ts carries whatever source JSDoc that branch kept. Leaves
preview-release.yml to go on serving main and pull requests.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 8: Report, and stop before the first real freeze**

Summarise: the commands that ran and their results, the branch, and the fact that no real freeze has happened yet.

Do **not** run a full `pnpm experiment:freeze` to completion, and do **not** push anything. The first real freeze wants the classification in place and is a deliberate act for the user to trigger. Ask before going further.

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task: layout and root wiring → Task 1; corpus globs → Task 11; taxonomy → Task 2; `experiments.config.ts` → Task 3; the port matrix → Tasks 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14; the `source-transform` rewrite → Task 5; the `story-transform` fix → Task 6; dead code and formatting → Tasks 9 and 10; publishing → Tasks 15, 16 and 17; testing → the test step of every task; the "touches no content" constraint → Global Constraints plus Task 17 Step 5. The spec's `experiment/empty` warning is carried in the `experiments.config.ts` docblock in Task 3.

**Type consistency.** `version` is a `number` everywhere — `manifest.ts` (Task 4), `regenerateExperiments` (Task 13), `VERSION = 1` in `cli.ts` (Task 14), and `version: 1` in both tests. Upstream's `freeze.test.ts` passes the string `'0.1.0'`; that is corrected here and called out where it happens. `TransformResult` is declared separately in `source-transform.ts` and `deadcode.ts`, as upstream does; the Interfaces block for Task 9 says so, so nobody tries to import one from the other. `Labels`, `ExperimentConfig`, `CorpusSummary` and `PushOutcome` keep the names and shapes their producing task declares.

**Facet names.** `classification-labels.jsonc` (Task 2), `experiments.config.ts` (Task 3) and Global Constraints list the same facets, and Task 3 Step 6 fails the build if they ever drift.
