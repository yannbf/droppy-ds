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
