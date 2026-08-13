import type { ComponentProps, PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Applies the max-width and side padding starting at the desktop breakpoint
   *  (1024px) instead of immediately. Below that width the wrapper adds no
   *  constraint of its own, so a caller supplies its own mobile layout and lets
   *  `Container` take over once the page is wide enough to want the bound. */
  desktopOnly?: boolean
  className?: string
}

export type ContainerProps = DefaultProps & Omit<ComponentProps<'div'>, keyof DefaultProps>

export const Container = ({
  children,
  desktopOnly = false,
  className,
  ...rest
}: PropsWithChildren<ContainerProps>) => (
  <div
    data-part="root"
    className={cx('droppy-Container', desktopOnly && 'droppy-Container--desktopOnly', className)}
    {...rest}
  >
    {children}
  </div>
)
