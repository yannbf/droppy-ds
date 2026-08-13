import { describe, expect, it } from 'vitest'

import { leadingBlockComment, parse } from './oxc-utils'

describe('parse', () => {
  it('returns the program and its comments', () => {
    const { program, comments } = parse('a.tsx', '/** doc */\nexport const a = 1\n')
    expect(program.body).toHaveLength(1)
    expect(comments).toHaveLength(1)
    expect(comments[0].type).toBe('Block')
  })

  it('throws a Droppy error naming the file on a syntax error', () => {
    expect(() => parse('bad.tsx', 'const = = 1')).toThrow(/could not parse bad\.tsx/)
  })
})

describe('leadingBlockComment', () => {
  it('finds the block comment directly above a node', () => {
    const code = '/** doc */\nexport const a = 1\n'
    const { program, comments } = parse('a.tsx', code)
    const range = leadingBlockComment(program.body[0], comments, code)
    expect(range).not.toBeNull()
    expect(code.slice(range!.start, range!.end)).toBe('/** doc */\n')
  })

  it('ignores a block comment separated from the node by code', () => {
    const code = '/** doc */\nconst b = 2\nexport const a = 1\n'
    const { program, comments } = parse('a.tsx', code)
    expect(leadingBlockComment(program.body[1], comments, code)).toBeNull()
  })

  it('ignores line comments', () => {
    const code = '// doc\nexport const a = 1\n'
    const { program, comments } = parse('a.tsx', code)
    expect(leadingBlockComment(program.body[0], comments, code)).toBeNull()
  })
})
