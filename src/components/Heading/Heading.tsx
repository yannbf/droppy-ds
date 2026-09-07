import { forwardRef, type ComponentProps, type ElementType, type PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  level?: 1 | 2 | 3 | 4 | 5
  size?: 1 | 2 | 3 | 4 | 5
  className?: string
}

export type HeadingProps = DefaultProps & Omit<ComponentProps<'h1'>, keyof DefaultProps>

export const Heading = forwardRef<HTMLHeadingElement, PropsWithChildren<HeadingProps>>(
  ({ level = 1, size, children, className, ...rest }, ref) => {
    const Tag = `h${level}` as ElementType
    const visualSize = size ?? level

    return (
      <Tag
        ref={ref}
        data-part="root"
        className={cx('droppy-Heading', `droppy-Heading--${visualSize}`, className)}
        {...rest}
      >
        {children}
      </Tag>
    )
  }
)

Heading.displayName = 'Heading'
