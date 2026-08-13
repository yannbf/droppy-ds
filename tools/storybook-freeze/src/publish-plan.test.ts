import { describe, expect, it } from 'vitest'

import { planBranchPush } from './publish-plan'

const config = ['experiment/a', 'experiment/b']

describe('planBranchPush', () => {
  it('pushes a configured branch that differs from the remote', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: new Map([['experiment/a', 'old']]),
    })
    expect(plan.push).toEqual(['experiment/a', 'experiment/b'])
    expect(plan.upToDate).toEqual([])
  })

  it('skips a branch the remote already matches', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'old'],
      ]),
    })
    expect(plan.push).toEqual(['experiment/b'])
    expect(plan.upToDate).toEqual(['experiment/a'])
  })

  it('pushes an up-to-date branch anyway under force', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      force: true,
    })
    expect(plan.push).toEqual(config)
    expect(plan.upToDate).toEqual([])
  })

  it('pushes everything when the remote could not be read', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
      ]),
      remoteShas: undefined,
    })
    expect(plan.push).toEqual(config)
  })

  it('reports a configured branch with no local branch as missing', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([['experiment/a', 'aaa']]),
      remoteShas: new Map(),
    })
    expect(plan.push).toEqual(['experiment/a'])
    expect(plan.missing).toEqual(['experiment/b'])
  })

  it('reports a local experiment branch absent from the config as stray', () => {
    const plan = planBranchPush({
      configBranches: config,
      localShas: new Map([
        ['experiment/a', 'aaa'],
        ['experiment/b', 'bbb'],
        ['experiment/retired', 'ccc'],
        ['main', 'ddd'],
      ]),
      remoteShas: new Map(),
    })
    expect(plan.stray).toEqual(['experiment/retired'])
    expect(plan.push).not.toContain('experiment/retired')
    expect(plan.stray).not.toContain('main')
  })
})
