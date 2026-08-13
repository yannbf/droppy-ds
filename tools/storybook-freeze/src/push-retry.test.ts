import { describe, expect, it, vi } from 'vitest'

import { isTransientPushError, pushWithRetry, retryDelayMs } from './push-retry'

const noSleep = async (): Promise<void> => undefined

describe('isTransientPushError', () => {
  it('recognises the network and server failures worth retrying', () => {
    expect(isTransientPushError('RPC failed; HTTP 502 curl 22')).toBe(true)
    expect(isTransientPushError('the remote end hung up unexpectedly')).toBe(true)
    expect(isTransientPushError('early EOF')).toBe(true)
    expect(isTransientPushError('Connection reset by peer')).toBe(true)
  })

  it('does not recognise a real rejection', () => {
    expect(isTransientPushError('Permission denied (publickey)')).toBe(false)
    expect(isTransientPushError('! [rejected] experiment/a -> experiment/a')).toBe(false)
  })
})

describe('retryDelayMs', () => {
  it('backs off exponentially and caps at a minute', () => {
    expect(retryDelayMs(1)).toBe(3000)
    expect(retryDelayMs(2)).toBe(9000)
    expect(retryDelayMs(3)).toBe(27_000)
    expect(retryDelayMs(9)).toBe(60_000)
  })
})

describe('pushWithRetry', () => {
  it('reports a single attempt when the push succeeds', async () => {
    const push = vi.fn(async () => undefined)
    const outcome = await pushWithRetry({ attempts: 3, push, sleep: noSleep })
    expect(outcome).toEqual({ attempts: 1, landedDespiteError: false })
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('retries a transient failure and reports the attempt count', async () => {
    const push = vi
      .fn()
      .mockRejectedValueOnce(new Error('RPC failed; HTTP 502'))
      .mockResolvedValueOnce(undefined)
    const outcome = await pushWithRetry({ attempts: 3, push, sleep: noSleep })
    expect(outcome.attempts).toBe(2)
    expect(push).toHaveBeenCalledTimes(2)
  })

  it('rethrows a non-transient failure without retrying', async () => {
    const push = vi.fn().mockRejectedValue(new Error('Permission denied (publickey)'))
    await expect(pushWithRetry({ attempts: 3, push, sleep: noSleep })).rejects.toThrow(
      /Permission denied/
    )
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('rethrows once the attempts are exhausted', async () => {
    const push = vi.fn().mockRejectedValue(new Error('early EOF'))
    await expect(pushWithRetry({ attempts: 2, push, sleep: noSleep })).rejects.toThrow(/early EOF/)
    expect(push).toHaveBeenCalledTimes(2)
  })

  it('treats a verified ref as landed even though the push reported an error', async () => {
    const push = vi.fn().mockRejectedValue(new Error('early EOF'))
    const outcome = await pushWithRetry({
      attempts: 3,
      push,
      verify: async () => true,
      sleep: noSleep,
    })
    expect(outcome).toEqual({ attempts: 1, landedDespiteError: true })
    expect(push).toHaveBeenCalledTimes(1)
  })

  it('does not let a throwing verify mask the push error', async () => {
    const push = vi.fn().mockRejectedValue(new Error('Permission denied (publickey)'))
    await expect(
      pushWithRetry({
        attempts: 2,
        push,
        verify: async () => {
          throw new Error('ls-remote failed')
        },
        sleep: noSleep,
      })
    ).rejects.toThrow(/Permission denied/)
  })

  it('reports each retry to the caller', async () => {
    const push = vi
      .fn()
      .mockRejectedValueOnce(new Error('early EOF'))
      .mockResolvedValueOnce(undefined)
    const onRetry = vi.fn()
    await pushWithRetry({ attempts: 3, push, onRetry, sleep: noSleep })
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onRetry.mock.calls[0][0]).toMatchObject({ attempt: 1, attempts: 3, delayMs: 3000 })
  })
})
