import type { ComponentProps, PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Hover dim + pointer cursor. The shell only — callers wire their own onClick. */
  interactive?: boolean
  /** Adds `--ds-space-sm` padding on all sides. Bare by default, since most of
   *  the components this replaces already own their internal padding. */
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
