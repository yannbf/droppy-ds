import { describe, expect, it } from 'vitest'

import { type Labels } from './labels'
import { transformStory } from './story-transform'

const labels: Labels = {
  definedFacets: [],
  deleteFacets: new Set(['story.anatomy']),
  storyTags: new Set(['showcase', 'highlight', 'api-ref', 'anatomy']),
  isKept: (f, keep) => f !== 'story.anatomy' && keep.has(f),
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

  it('always strips story.anatomy exports, because delete wins over keep', () => {
    const code = [
      'const meta = {} satisfies Meta',
      'export default meta',
      'type Story = StoryObj<typeof meta>',
      "export const Anatomy: Story = { tags: ['anatomy'], render: () => null }",
      '',
    ].join('\n')
    const result = transformStory('A.stories.tsx', code, new Set(['story.anatomy']), labels)
    expect(result.code).not.toContain('export const Anatomy')
    expect(result.remainingStoryExports).toBe(0)
    expect(result.removedStoryExports).toBe(1)
  })
})
