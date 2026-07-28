import { useEffect, useState } from 'react'

/**
 * Resolves a portal container that may be given as an element or a selector.
 *
 * A selector cannot be resolved during render — the node may not be in the
 * document yet, and touching `document` on the server throws — so it resolves
 * in an effect and the first paint portals nowhere. That is the correct
 * ordering for an overlay, which is closed on first paint anyway.
 *
 * Returns `undefined` when nothing is specified, which is Base UI's signal to
 * use its own default container.
 */
export function useContainer(container?: HTMLElement | string | null) {
  const [resolved, setResolved] = useState<HTMLElement | null>(
    typeof container === 'string' ? null : (container ?? null)
  )

  useEffect(() => {
    if (typeof container === 'string') {
      setResolved(document.querySelector<HTMLElement>(container))
    } else {
      setResolved(container ?? null)
    }
  }, [container])

  return resolved ?? undefined
}
