import type { ComponentProps } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  value: number
  max?: number
  label?: string
  className?: string
}

export type ProgressBarProps = DefaultProps &
  Omit<ComponentProps<'div'>, keyof DefaultProps | 'role' | 'aria-label'>

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
