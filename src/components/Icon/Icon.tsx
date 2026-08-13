import type { ComponentProps } from 'react'

import { cx } from '../../utils/cx'

import { icons, type IconName } from './icons'

export type IconProps = {
  /** Which icon to render. */
  name: IconName
  /** Overrides the stroke colour. Defaults to the theme's icon token. */
  color?: string
  /** Rendered width and height. */
  size?: number | string
} & Omit<ComponentProps<'svg'>, 'color'>

export const Icon = ({ name, color, size = '1.5rem', className, style, ...rest }: IconProps) => {
  const icon = icons[name]

  return (
    <svg
      data-part="root"
      className={cx('droppy-Icon', className)}
      viewBox={icon.viewBox}
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      // `minWidth` keeps the icon from being squeezed by a flex parent, and the
      // inline stroke has to beat the class rule when `color` is given.
      style={{
        width: size,
        height: size,
        minWidth: size,
        ...(color && { stroke: color }),
        ...style,
      }}
      {...rest}
    >
      {icon.content}
    </svg>
  )
}

export type { IconName }
export { iconNames } from './icons'
