import type { ComponentProps, PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  interactive?: boolean
  padded?: boolean
  className?: string
}

export type CardProps = DefaultProps & Omit<ComponentProps<'div'>, keyof DefaultProps>

export const Card = ({
  children,
  interactive = false,
  padded = false,
  className,
  ...rest
}: PropsWithChildren<CardProps>) => (
  <div
    data-part="root"
    className={cx(
      'droppy-Card',
      interactive && 'droppy-Card--interactive',
      padded && 'droppy-Card--padded',
      className
    )}
    {...rest}
  >
    {children}
  </div>
)
