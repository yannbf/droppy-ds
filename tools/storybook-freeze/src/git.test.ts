import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  assertClean,
  commitAll,
  createGit,
  currentRef,
  headSha,
  localBranchShas,
  localBranches,
  remoteUrl,
  resetBranchToHead,
} from './git'

let dir: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-git-'))
  const git = createGit(dir)
  await git.init()
  await git.addConfig('user.email', 'test@example.com')
  await git.addConfig('user.name', 'Test')
  await writeFile(path.join(dir, 'a.txt'), 'a\n')
  await git.add(['-A'])
  await git.commit('initial')
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

describe('assertClean', () => {
  it('resolves on a clean tree', async () => {
    await expect(assertClean(createGit(dir))).resolves.toBeUndefined()
  })

  it('throws a Droppy error on a dirty tree', async () => {
    await writeFile(path.join(dir, 'dirty.txt'), 'x\n')
    await expect(assertClean(createGit(dir))).rejects.toThrow(/clean working tree/)
  })
})

describe('headSha and localBranchShas', () => {
  it('agree on where the current branch points', async () => {
    const git = createGit(dir)
    const head = await headSha(git)
    const branch = await currentRef(git)
    expect((await localBranchShas(git)).get(branch)).toBe(head)
  })
})

describe('resetBranchToHead', () => {
  it('creates a branch at HEAD and lists it', async () => {
    const git = createGit(dir)
    await resetBranchToHead(git, 'experiment/x')
    expect(await localBranches(git)).toContain('experiment/x')
    expect(await currentRef(git)).toBe('experiment/x')
  })
})

describe('commitAll', () => {
  it('stages everything and commits, leaving the tree clean', async () => {
    const git = createGit(dir)
    const before = await headSha(git)
    await writeFile(path.join(dir, 'b.txt'), 'b\n')
    await commitAll(git, 'second')
    expect(await headSha(git)).not.toBe(before)
    await expect(assertClean(git)).resolves.toBeUndefined()
  })
})

describe('remoteUrl', () => {
  it('returns undefined when the remote does not exist', async () => {
    expect(await remoteUrl(createGit(dir), 'origin')).toBeUndefined()
  })

  it('returns the configured url', async () => {
    const git = createGit(dir)
    await git.addRemote('origin', 'git@example.com:acme/repo.git')
    expect(await remoteUrl(git, 'origin')).toBe('git@example.com:acme/repo.git')
  })
})
