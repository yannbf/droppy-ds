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
  purgeAllDocgen: false,
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
    expect(manifest.purgeAllDocgen).toBe(false)
  })

  it('records purgeAllDocgen so the Storybook build on the branch can read it', () => {
    expect(buildManifest({ ...args, purgeAllDocgen: true }).purgeAllDocgen).toBe(true)
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
