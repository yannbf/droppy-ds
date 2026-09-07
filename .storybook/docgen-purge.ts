import { existsSync, readFileSync } from 'node:fs'

/**
 * Support for the experiments' `purgeAllDocgen` flag (see experiments.config.ts). The freeze
 * tool records the flag in the experiment.json it commits to each generated branch; main.ts
 * reads it back here and, when set, wraps the `experimental_manifests` preset so the branch's
 * Storybook build publishes manifests with no generated docgen in them.
 */

/**
 * The fields docgen extraction writes into a components-manifest entry (and into each of its
 * subcomponents): the engine payloads with prop/type tables, plus the descriptions, summaries,
 * and errors the extraction derives from JSDoc. This mirrors Storybook's DocgenPayload; what
 * remains in an entry is CSF-derived (stories, import) or MDX-derived (docs), so it is
 * governed by the experiment's facets instead.
 */
const DOCGEN_FIELDS = [
  'reactDocgen',
  'reactDocgenTypescript',
  'reactComponentMeta',
  'argTypes',
  'description',
  'summary',
  'error',
]

/**
 * Minimal structural view of Storybook's `Manifests`: the public `ComponentsManifest` type
 * does not declare the per-engine payload fields this module removes, so typing against the
 * shape keeps the module honest about what it relies on.
 */
interface ManifestsLike {
  components?: {
    components: Record<string, object>
  }
}

function stripDocgenFields<T extends object>(entry: T): T {
  const cleaned = { ...entry } as Record<string, unknown>
  for (const field of DOCGEN_FIELDS) {
    delete cleaned[field]
  }
  // The manifest type requires jsDocTags, so empty it instead of deleting it.
  if (cleaned.jsDocTags !== undefined) {
    cleaned.jsDocTags = {}
  }
  if (cleaned.subcomponents !== undefined && typeof cleaned.subcomponents === 'object') {
    cleaned.subcomponents = Object.fromEntries(
      Object.entries(cleaned.subcomponents as Record<string, object>).map(([name, sub]) => [
        name,
        stripDocgenFields(sub),
      ])
    )
  }
  return cleaned as T
}

/** Return a copy of `manifests` whose components manifest carries no docgen output at all. */
export function purgeDocgenFromManifests<T extends ManifestsLike>(manifests: T): T {
  const components = manifests.components
  if (!components) {
    return manifests
  }
  return {
    ...manifests,
    components: {
      ...components,
      components: Object.fromEntries(
        Object.entries(components.components).map(([id, entry]) => [id, stripDocgenFields(entry)])
      ),
    },
  }
}

/**
 * Read the `purgeAllDocgen` flag from a freeze-committed experiment.json. Missing file means a
 * regular checkout (main, or a branch frozen without the flag): no purge. An unreadable file
 * fails the build instead of guessing, so a purge experiment can never silently publish
 * docgen.
 */
export function readPurgeAllDocgen(experimentJsonPath: string): boolean {
  if (!existsSync(experimentJsonPath)) {
    return false
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(experimentJsonPath, 'utf8'))
  } catch (error) {
    throw new Error(
      `Droppy: ${experimentJsonPath} is not valid JSON, so the build cannot tell whether ` +
        'this experiment branch wants its docgen purged. The freeze tool writes this file; ' +
        `regenerate the branch with pnpm experiment:freeze. (${(error as Error).message})`
    )
  }
  return (
    typeof parsed === 'object' &&
    parsed !== null &&
    (parsed as Record<string, unknown>).purgeAllDocgen === true
  )
}
