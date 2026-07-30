import type { CSSProperties } from 'react'

import { cx } from '../../utils/cx'

export type SkeletonProps = {
  /** Numbers are treated as pixels; strings pass through unchanged. Defaults to `100%`. */
  width?: string | number
  /** Numbers are treated as pixels; strings pass through unchanged. Defaults to `1em`. */
  height?: string | number
  className?: string
  style?: CSSProperties
}

const toDimension = (value: string | number | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

/**
 * Loading placeholder for content whose text or final size isn't known yet.
 *
 * Renders a `span` so it can sit inline inside a `Heading` or a line of text
 * and take on the surrounding font size. `aria-hidden` because a placeholder
 * announces nothing — the loading state belongs to whatever container renders
 * it, not to the placeholder itself.
 */
export const Skeleton = ({ width, height, className, style }: SkeletonProps) => (
  <span
    className={cx('droppy-Skeleton', className)}
    aria-hidden="true"
    style={{
      width: toDimension(width) ?? '100%',
      height: toDimension(height) ?? '1em',
      ...style,
    }}
  />
)
