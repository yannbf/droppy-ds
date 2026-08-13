import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { removeUnusedImports } from './biome'

let dir: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-biome-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('removeUnusedImports', () => {
  it('removes an unused named import and keeps the used one', async () => {
    const file = path.join(dir, 'a.tsx')
    await writeFile(
      file,
      ['import { Used, Unused } from "./m";', 'export const a = Used;', ''].join('\n')
    )
    removeUnusedImports([file], dir)
    const code = await readFile(file, 'utf8')
    expect(code).toContain('Used')
    expect(code).not.toContain('Unused')
  })

  it('removes an import statement left with nothing used', async () => {
    const file = path.join(dir, 'b.tsx')
    await writeFile(file, ['import { Gone } from "./m";', 'export const b = 1;', ''].join('\n'))
    removeUnusedImports([file], dir)
    const code = await readFile(file, 'utf8')
    expect(code).not.toContain('./m')
    expect(code).toContain('export const b')
  })

  it('does nothing when given no files', () => {
    expect(() => removeUnusedImports([], dir)).not.toThrow()
  })
})
