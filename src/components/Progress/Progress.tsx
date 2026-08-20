import type { ComponentProps, ReactNode } from 'react'
import { Progress as BaseProgress } from '@base-ui/react/progress'
import theme from '../../theme'

import { cx } from '../../utils/cx'

type DefaultProps = {
  value?: number | null
  max?: number
  label?: ReactNode
  showValue?: boolean
  className?: string
}

export type ProgressProps = DefaultProps &
  Omit<ComponentProps<typeof BaseProgress.Root>, keyof DefaultProps | 'value' | 'render'>

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
