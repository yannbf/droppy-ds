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

  it('does not define base-ui-only facets', () => {
    expect(labels.definedFacets).not.toContain('story.base')
    expect(labels.definedFacets).not.toContain('mdx.testing')
  })

  it('returns the facets sorted', () => {
    expect(labels.definedFacets).toEqual([...labels.definedFacets].sort())
  })

  it('exposes bare story tag leaves', () => {
    expect(labels.storyTags.has('showcase')).toBe(true)
    expect(labels.storyTags.has('base')).toBe(false)
  })

  it('isKept is false for a facet absent from the keep set', () => {
    expect(labels.isKept('story.showcase', new Set())).toBe(false)
  })
})
