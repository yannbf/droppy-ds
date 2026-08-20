import type { ComponentProps } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'

import { Icon, type IconName } from '../Icon'
import { cx } from '../../utils/cx'

type DefaultProps = {
  name: IconName
  small?: boolean
  onClick?: () => void
}

export type IconButtonProps = DefaultProps & Omit<ComponentProps<'button'>, keyof DefaultProps>

export const IconButton = ({ small = false, name, className, ...rest }: IconButtonProps) => (
  <BaseButton
    data-part="root"
    type="button"
    className={cx('droppy-IconButton', small && 'droppy-IconButton--small', className)}
    {...rest}
  >
    <Icon data-part="icon" name={name} size={small ? 15 : 24} />
  </BaseButton>
)
