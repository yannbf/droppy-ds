import { forwardRef, type ComponentProps, type ElementType, type PropsWithChildren } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** The rendered tag (`h1`–`h5`). Also the size step when `size` is unset. */
  level?: 1 | 2 | 3 | 4 | 5
  /** Visual size step. Defaults to `level`, so setting `level` alone keeps
   *  the tag and the size together. Pass `size` to pick the visual size
   *  independently of the semantic level — the tag still follows `level`. */
  size?: 1 | 2 | 3 | 4 | 5
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
