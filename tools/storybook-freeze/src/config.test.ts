import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { loadExperiments, validateExperiments } from './config'
import { loadLabels, type Labels } from './labels'

const labels: Labels = {
  definedFacets: ['story.showcase', 'story.api-ref', 'mdx.general'],
  deleteFacets: new Set(['story.anatomy']),
  storyTags: new Set(['showcase', 'api-ref', 'anatomy']),
  isKept: (f, keep) => f !== 'story.anatomy' && keep.has(f),
}

describe('validateExperiments', () => {
  it('accepts a well-formed config', () => {
    const raw = [
      { branchName: 'experiment/showcase', facets: ['story.showcase'] },
      {
        branchName: 'experiment/api',
        facets: ['story.api-ref', 'mdx.general'],
        keepEmptyCsf: true,
        purgeAllDocgen: true,
      },
    ]
    expect(validateExperiments(raw, labels)).toEqual([
      {
        branchName: 'experiment/showcase',
        facets: ['story.showcase'],
        keepEmptyCsf: false,
        purgeAllDocgen: false,
      },
      {
        branchName: 'experiment/api',
        facets: ['story.api-ref', 'mdx.general'],
        keepEmptyCsf: true,
        purgeAllDocgen: true,
      },
    ])
  })

  it('accepts an entry with no facets at all', () => {
    const raw = [{ branchName: 'experiment/empty', facets: [] }]
    expect(validateExperiments(raw, labels)).toEqual([
      { branchName: 'experiment/empty', facets: [], keepEmptyCsf: false, purgeAllDocgen: false },
    ])
  })

  it('rejects a non-boolean keepEmptyCsf', () => {
    const raw = [{ branchName: 'experiment/x', facets: [], keepEmptyCsf: 'yes' }]
    expect(() => validateExperiments(raw, labels)).toThrow(/invalid keepEmptyCsf/)
  })

  it('rejects a non-boolean purgeAllDocgen', () => {
    const raw = [{ branchName: 'experiment/x', facets: [], purgeAllDocgen: 'yes' }]
    expect(() => validateExperiments(raw, labels)).toThrow(/invalid purgeAllDocgen/)
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
    const raw = [{ branchName: 'experiment/x', facets: ['story.anatomy'] }]
    expect(() => validateExperiments(raw, labels)).toThrow(/unknown facets: story\.anatomy/)
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

describe('the repo experiments.config.ts', () => {
  it('validates against the real taxonomy', async () => {
    const root = path.resolve(fileURLToPath(import.meta.url), '../../../..')
    const labelsFromDisk = loadLabels(path.join(root, 'classification-labels.jsonc'))
    const validated = validateExperiments(await loadExperiments(root), labelsFromDisk)
    expect(validated).toHaveLength(17)
    expect(validated.map((entry) => entry.branchName)).toContain('experiment/full')
  })

  it('gives purge-docgen the same facets as full, plus the purge flag', async () => {
    const root = path.resolve(fileURLToPath(import.meta.url), '../../../..')
    const labelsFromDisk = loadLabels(path.join(root, 'classification-labels.jsonc'))
    const validated = validateExperiments(await loadExperiments(root), labelsFromDisk)
    const full = validated.find((entry) => entry.branchName === 'experiment/full')
    const purge = validated.find((entry) => entry.branchName === 'experiment/purge-docgen')
    expect(purge?.facets).toEqual(full?.facets)
    expect(full?.purgeAllDocgen).toBe(false)
    expect(purge?.purgeAllDocgen).toBe(true)
  })
})
