import { forwardRef, type ComponentProps, type ElementType, type PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Both the rendered tag (`h1`–`h5`) and the size step. */
  level?: 1 | 2 | 3 | 4 | 5
  className?: string
}

export type HeadingProps = DefaultProps & Omit<ComponentProps<'h1'>, keyof DefaultProps>

/**
 * Display type.
 *
 * Forwards its ref and the rest of its props so composition wrappers — Base
 * UI's `Drawer.Title`, `Dialog.Title` — can wire `aria-labelledby` to the real
 * heading element.
 */
export const Heading = forwardRef<HTMLHeadingElement, PropsWithChildren<HeadingProps>>(
  ({ level = 1, children, className, ...rest }, ref) => {
    const Tag = `h${level}` as ElementType

    return (
      <Tag
        ref={ref}
        className={cx('droppy-Heading', `droppy-Heading--${level}`, className)}
        {...rest}
      >
        {children}
      </Tag>
    )
  }
)

Heading.displayName = 'Heading'
