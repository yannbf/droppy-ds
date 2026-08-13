import type { ComponentProps } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** How far along the track the fill sits. Clamped to `0`–`max` before it reaches the DOM. */
  value: number
  /** Upper bound `value` is measured against. */
  max?: number
  /** Accessible name — the title/copy around the bar lives in the caller's own markup. */
  label?: string
  className?: string
}

export type ProgressBarProps = DefaultProps &
  Omit<ComponentProps<'div'>, keyof DefaultProps | 'role' | 'aria-label'>

/**
 * A track-and-fill indicator for progress through a known number of steps —
 * a multi-step checkout, an upload, a form with a fixed page count.
 *
 * Renders `role="progressbar"` with `aria-valuenow`/`-min`/`-max` on the
 * track; the fill is a plain, `aria-hidden` sibling underneath it.
 */
export const ProgressBar = ({ value, max = 100, label, className, ...rest }: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clampedValue / max) * 100 : 0

  return (
    <div
      data-part="root"
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cx('droppy-ProgressBar', className)}
      {...rest}
    >
      <div data-part="fill" className="droppy-ProgressBar-fill" style={{ width: `${percent}%` }} />
    </div>
  )
}
