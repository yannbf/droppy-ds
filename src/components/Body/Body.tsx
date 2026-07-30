import type { ComponentProps, CSSProperties, ElementType, ReactNode } from 'react'

import { cx } from '../../utils/cx'

type BodySize = 'S' | 'XS' | 'XXS'
type BodyWeight = 'regular' | 'medium' | 'bold' | 'black'
type BodyElement = 'span' | 'p' | 'label' | 'figcaption'

type ElementProps<T extends BodyElement> = T extends 'label'
  ? ComponentProps<'label'>
  : T extends 'span'
    ? ComponentProps<'span'>
    : T extends 'p'
      ? ComponentProps<'p'>
      : ComponentProps<'figcaption'>

type DefaultProps = {
  className?: string
  /** Visual size step. Absent renders the base body size. */
  size?: BodySize
  /** Font weight. */
  fontWeight?: BodyWeight
  /** Rendered element. */
  type?: BodyElement
  /** Overrides the text color inline. Unset, follows the theme's primary text token. */
  color?: string
  children: ReactNode
}

export type BodyProps = DefaultProps & ElementProps<BodyElement>

const sizeClassName: Record<BodySize, string> = {
  S: 'droppy-Body--size-s',
  XS: 'droppy-Body--size-xs',
  XXS: 'droppy-Body--size-xxs',
}

const weightClassName: Record<BodyWeight, string> = {
  regular: '',
  medium: 'droppy-Body--weight-medium',
  bold: 'droppy-Body--weight-bold',
  black: 'droppy-Body--weight-black',
}

/**
 * Plain-text typography — the body-copy counterpart to `Heading`.
 *
 * `type` picks the rendered element (`p` by default, or `span`, `label`,
 * `figcaption`); `size` and `fontWeight` pick the type-scale step and weight
 * independently of it, so any of the four elements can land on the same
 * scale.
 */
export const Body = ({
  size,
  fontWeight = 'regular',
  type = 'p',
  color,
  children,
  className,
  style,
  ...rest
}: BodyProps) => {
  const Tag = type as ElementType

  return (
    <Tag
      className={cx(
        'droppy-Body',
        size && sizeClassName[size],
        weightClassName[fontWeight],
        className
      )}
      style={color ? ({ color, ...style } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
