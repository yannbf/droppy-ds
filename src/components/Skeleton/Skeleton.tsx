import type { CSSProperties } from 'react'

import { cx } from '../../utils/cx'

export type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
  style?: CSSProperties
}

const toDimension = (value: string | number | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

export const Skeleton = ({ width, height, className, style }: SkeletonProps) => (
  <span
    data-part="root"
    className={cx('droppy-Skeleton', className)}
    aria-hidden="true"
    style={{
      width: toDimension(width) ?? '100%',
      height: toDimension(height) ?? '1em',
      ...style,
    }}
  />
)
