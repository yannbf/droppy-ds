import { readFile, writeFile } from 'node:fs/promises'

import { removeUnusedImports } from './biome'
import { type ExperimentConfig } from './config'
import { runCorpus, type CorpusSummary } from './corpus'
import { removeUnusedTopLevel } from './deadcode'
import { formatFiles } from './format'
import {
  assertClean,
  checkoutRef,
  commitAll,
  createGit,
  currentRef,
  headSha,
  resetBranchToHead,
} from './git'
import { type Labels } from './labels'
import { buildManifest, writeManifest } from './manifest'

export interface BranchResult {
  branch: string
  summary: CorpusSummary
}

/**
 * Story files lose helper functions and imports when their stories are stripped. Delete the
 * now-unreferenced top-level declarations (oxc), then let Biome drop the imports they freed.
 */
async function purgeDeadCode(writtenFiles: string[], cwd: string): Promise<void> {
  const storyFiles = writtenFiles.filter((file) => file.endsWith('.stories.tsx'))
  if (storyFiles.length === 0) {
    return
  }
  await Promise.all(
    storyFiles.map(async (file) => {
      const code = await readFile(file, 'utf8')
      const purged = removeUnusedTopLevel(file, code)
      if (purged.changed) {
        await writeFile(file, purged.code)
      }
    })
  )
  removeUnusedImports(storyFiles, cwd)
}

/**
 * Build one experiment branch from `baseRef`: reset the branch to base, strip the corpus for
 * `facets`, purge dead code, format, write the manifest, and commit. Assumes a clean tree.
 */
export async function buildExperimentBranch(opts: {
  cwd: string
  git: ReturnType<typeof createGit>
  branchName: string
  facets: string[]
  keepEmptyCsf: boolean
  labels: Labels
  baseRef: string
  baseCommit: string
  now: string
  version: number
}): Promise<BranchResult> {
  await checkoutRef(opts.git, opts.baseRef)
  await resetBranchToHead(opts.git, opts.branchName)

  const keep = new Set(opts.facets)
  const summary = await runCorpus(opts.cwd, keep, opts.labels, opts.keepEmptyCsf)
  await purgeDeadCode(summary.written, opts.cwd)
  await formatFiles(summary.written)

  const manifest = buildManifest({
    branchName: opts.branchName,
    baseCommit: opts.baseCommit,
    keptFacets: opts.facets,
    createdAt: opts.now,
    version: opts.version,
  })
  await writeManifest(opts.cwd, manifest)

  await commitAll(opts.git, `[storybook-freeze] Freeze ${opts.branchName}`)
  return { branch: opts.branchName, summary }
}

/**
 * Regenerate every configured experiment branch from the current HEAD, then return to it.
 * Requires a clean working tree. Existing target branches are reset (overwritten) — the CLI
 * is responsible for confirming that with the user first.
 */
export async function regenerateExperiments(opts: {
  cwd: string
  experiments: ExperimentConfig[]
  labels: Labels
  now: string
  version: number
}): Promise<BranchResult[]> {
  const git = createGit(opts.cwd)
  await assertClean(git)
  const baseRef = await currentRef(git)
  const baseCommit = await headSha(git)

  const results: BranchResult[] = []
  // Branches share one working tree, so they must be built one at a time.
  for (const experiment of opts.experiments) {
    const result = await buildExperimentBranch({
      cwd: opts.cwd,
      git,
      branchName: experiment.branchName,
      facets: experiment.facets,
      keepEmptyCsf: experiment.keepEmptyCsf,
      labels: opts.labels,
      baseRef,
      baseCommit,
      now: opts.now,
      version: opts.version,
    })
    results.push(result)
  }

  await checkoutRef(git, baseRef)
  return results
}
