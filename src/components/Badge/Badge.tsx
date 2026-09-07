import type { ComponentProps } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  text: string
  variant?: 'neutral' | 'positive'
  className?: string
}

export type BadgeProps = DefaultProps &
  Omit<ComponentProps<'span'>, keyof DefaultProps | 'children'>

export const Badge = ({ text, variant = 'neutral', className, ...rest }: BadgeProps) => (
  <span
    data-part="root"
    className={cx('droppy-Badge', variant === 'positive' && 'droppy-Badge--positive', className)}
    {...rest}
  >
    {text}
  </span>
)
