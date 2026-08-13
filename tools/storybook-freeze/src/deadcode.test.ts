import { describe, expect, it } from 'vitest'

import { removeUnusedTopLevel } from './deadcode'

describe('removeUnusedTopLevel', () => {
  it('removes an unreferenced non-exported const', () => {
    const code = ['const unused = 1', 'export const used = 2', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.changed).toBe(true)
    expect(result.code).not.toContain('unused')
    expect(result.code).toContain('export const used')
  })

  it('removes an unreferenced non-exported function and its JSDoc', () => {
    const code = ['/** A helper. */', 'function helper() {}', 'export const a = 1', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).not.toContain('helper')
    expect(result.code).not.toContain('A helper.')
  })

  it('keeps a declaration that is still referenced', () => {
    const code = ['const used = 1', 'export const a = used', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.changed).toBe(false)
    expect(result.code).toBe(code)
  })

  it('never removes an exported declaration, referenced or not', () => {
    const code = 'export const orphan = 1\n'
    expect(removeUnusedTopLevel('a.tsx', code).changed).toBe(false)
  })

  it('removes a chain of helpers down to a fixpoint', () => {
    const code = ['const inner = 1', 'const outer = inner + 1', 'export const a = 2', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).not.toContain('inner')
    expect(result.code).not.toContain('outer')
    expect(result.code).toContain('export const a')
  })

  it('keeps a helper referenced only from JSX', () => {
    const code = [
      'const Wrapper = () => null',
      'export const a = { render: () => <Wrapper /> }',
      '',
    ].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).toContain('Wrapper')
  })

  it("drops a story file's hide helper once every story using it is gone", () => {
    const code = [
      'const hide = (...props) => Object.fromEntries(props.map((p) => [p, {}]))',
      'const meta = { title: "Spinner" } satisfies Meta',
      'export default meta',
      '',
    ].join('\n')
    const result = removeUnusedTopLevel('S.stories.tsx', code)
    expect(result.code).not.toContain('const hide')
    expect(result.code).toContain('const meta')
  })

  it('leaves destructuring declarations alone', () => {
    const code = ['const { a, b } = obj', 'export const c = 1', ''].join('\n')
    const result = removeUnusedTopLevel('a.tsx', code)
    expect(result.code).toContain('const { a, b }')
  })

  it('preserves hide helper when still referenced by stories', () => {
    const code = [
      'const hide = (...props) => Object.fromEntries(props.map((p) => [p, {}]))',
      'export const Default = { argTypes: hide("size") }',
      'export const CustomLabel = { argTypes: hide("label") }',
      '',
    ].join('\n')
    const result = removeUnusedTopLevel('Spinner.stories.tsx', code)
    expect(result.changed).toBe(false)
    expect(result.code).toContain('const hide')
  })
})
