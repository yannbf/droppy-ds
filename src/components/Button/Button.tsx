import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import theme from '../../theme'

import { Icon, type IconName } from '../Icon'
import { cx } from '../../utils/cx'

type DefaultProps = {
  clear?: boolean
  round?: boolean
  large?: boolean
  icon?: IconName
  iconSize?: number
  disabled?: boolean
  children?: ReactNode
  onClick?: () => void
}

export type ButtonProps = DefaultProps & Omit<ComponentProps<'button'>, keyof DefaultProps>

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
    data-part="root"
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
    {icon && <Icon data-part="icon" name={icon} size={iconSize} />}
    {children}
  </BaseButton>
)
