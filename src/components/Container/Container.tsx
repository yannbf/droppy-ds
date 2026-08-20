import type { ComponentProps, PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
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
