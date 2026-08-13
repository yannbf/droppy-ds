import type { ComponentProps, ReactNode } from 'react'
import { Progress as BaseProgress } from '@base-ui/react/progress'
import theme from '../../theme'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Current value. `null` (or omitted) renders an indeterminate bar. */
  value?: number | null
  /** Upper bound `value` is measured against. */
  max?: number
  /** Accessible name, rendered above the track. */
  label?: ReactNode
  /** Renders the formatted value (a percentage by default) next to the label. */
  showValue?: boolean
  className?: string
}

export type ProgressProps = DefaultProps &
  Omit<ComponentProps<typeof BaseProgress.Root>, keyof DefaultProps | 'value' | 'render'>

/**
 * A track-and-fill indicator built on Base UI's `Progress`, adding a `Label`
 * and formatted `Value` part on top of the plain fill `ProgressBar` renders.
 * `value={null}` (or omitting it) puts the bar in indeterminate mode, for a
 * wait whose length or step count isn't known — something `ProgressBar` has
 * no way to express.
 */
export const Progress = ({
  value = null,
  max = 100,
  label,
  showValue,
  className,
  ...rest
}: ProgressProps) => (
  <BaseProgress.Root
    data-part="root"
    value={value}
    max={max}
    className={cx(theme.ProgressRoot, 'droppy-Progress', className)}
    {...rest}
  >
    {(label || showValue) && (
      <>
        {label && (
          <BaseProgress.Label data-part="label" className={theme.ProgressLabel}>
            {label}
          </BaseProgress.Label>
        )}
        {showValue && <BaseProgress.Value data-part="value" className={theme.ProgressValue} />}
      </>
    )}
    <BaseProgress.Track data-part="track" className={theme.ProgressTrack}>
      <BaseProgress.Indicator data-part="indicator" className={theme.ProgressIndicator} />
    </BaseProgress.Track>
  </BaseProgress.Root>
)
