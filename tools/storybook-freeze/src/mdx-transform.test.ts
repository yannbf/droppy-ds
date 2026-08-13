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
