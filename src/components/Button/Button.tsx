import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import theme from '@droppy/theme'

import { Icon, type IconName } from '../Icon'
import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Strips the fill, leaving just the label — for secondary actions. */
  clear?: boolean
  /** Fully rounded, for icon-only affordances like a close button. */
  round?: boolean
  /** Taller padding, for primary calls to action. */
  large?: boolean
  /** Renders an icon before the label. */
  icon?: IconName
  /** Overrides the icon's rendered size. */
  iconSize?: number
  disabled?: boolean
  children?: ReactNode
  onClick?: () => void
}

export type ButtonProps = DefaultProps & Omit<ComponentProps<'button'>, keyof DefaultProps>

/**
 * The primary action control.
 *
 * Chrome (fill, radius, focus ring, typeface, disabled state) comes from
 * `@droppy/theme`; Droppy layers the variants and the icon slot on top.
 */
export const Button = ({
  children,
  large = false,
  clear = false,
  round = false,
  icon,
  iconSize,
  className,
  ...rest
}: PropsWithChildren<ButtonProps>) => (
  <BaseButton
    type="button"
    className={cx(
      theme.Button,
      'droppy-Button',
      clear && 'droppy-Button--clear',
      large && 'droppy-Button--large',
      round && 'droppy-Button--round',
      icon && 'droppy-Button--withIcon',
      className
    )}
    {...rest}
  >
    {icon && <Icon name={icon} size={iconSize} />}
    {children}
  </BaseButton>
)
