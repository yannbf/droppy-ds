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
  size?: BodySize
  fontWeight?: BodyWeight
  type?: BodyElement
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
      data-part="root"
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
