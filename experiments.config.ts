/**
 * Experiments for the storybook-freeze CLI (`pnpm experiment:freeze`).
 *
 * Each entry regenerates one git branch containing only the listed facets; everything else is
 * stripped from the Storybook corpus. Facets are qualified `category.leaf` labels from
 * `classification-labels.jsonc`, excluding the always-stripped delete facets. Every
 * `branchName` must start with `experiment/`.
 *
 * Unlike base-ui, no story facet is pinned into every branch: there is no Droppy equivalent of
 * base-ui's `story.base` baseline, so a branch that selects no story facets has no real
 * stories. Every CSF file carries an `Empty` story (tagged `empty`, mandatory args only);
 * `keepEmptyCsf` decides its fate. When false (the default) `empty`-tagged stories are
 * deleted like any unkept story; when true they are kept, so a branch with no story facets
 * preserves its CSF files instead of deleting them.
 *
 * After regenerating, `pnpm experiment:publish-branches` force-pushes the branches to origin;
 * each push triggers the "Storybook MCP preview" workflow, which publishes that branch's
 * Storybook manifests as a @droppy/mcp server on pkg.pr.new.
 */
interface Experiment {
  branchName: string
  facets: string[]
  /** Keep stories tagged `empty` instead of deleting them. Defaults to false. */
  keepEmptyCsf?: boolean
  /** Strip all docgen output from the branch's Storybook build. Defaults to false. */
  purgeAllDocgen?: boolean
}

/** Documentation every branch keeps, so branches differ only in the facets under test. */
const BASE_FACETS = [
  'source-jsdoc.component',
  'source-jsdoc.props',
  'csf-jsdoc.meta',
  'csf-jsdoc.story',
  'mdx.anatomy',
  'story.anatomy',
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
  'story.anatomy',
]

/** The whole corpus: what `full` keeps, and what `purge-docgen` keeps minus the docgen. */
const FULL_FACETS = [...new Set([...BASE_FACETS, ...ALL_MDX, ...ALL_GENERAL, ...ALL_STORIES])]

const experiments: Experiment[] = [
  {
    branchName: 'experiment/empty',
    facets: [],
    keepEmptyCsf: true,
  },
  {
    branchName: 'experiment/full',
    facets: FULL_FACETS,
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
    // No story facets: without the empty CSF files the whole Storybook index
    // is empty and every component MDX page is dropped with its pruned CSF.
    branchName: 'experiment/docs-full',
    facets: [
      ...ALL_MDX,
      ...ALL_GENERAL,
      // Needed for mdx.anatomy to work, and also acts as an empty story to preserve CSF
      'story.anatomy',
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
    facets: [...ALL_STORIES],
  },
  {
    // Everything except the JSDoc in the component sources, to isolate what that JSDoc is worth.
    branchName: 'experiment/purge-jsdoc',
    facets: ['csf-jsdoc.meta', 'csf-jsdoc.story', ...ALL_MDX, ...ALL_GENERAL, ...ALL_STORIES],
  },
  {
    // Removes ALL docgen, including automatic docgen that can't otherwise be targeted.
    branchName: 'experiment/purge-docgen',
    facets: FULL_FACETS,
    purgeAllDocgen: true,
  },
]

export default experiments
