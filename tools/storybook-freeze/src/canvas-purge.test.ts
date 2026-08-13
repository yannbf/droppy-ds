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
