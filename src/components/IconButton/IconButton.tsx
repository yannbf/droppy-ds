import type { ComponentProps } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'

import { Icon, type IconName } from '../Icon'
import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Which icon to render. The button is icon-only, so pass `aria-label` too. */
  name: IconName
  /** Renders the 3rem variant instead of 4rem. */
  small?: boolean
  onClick?: () => void
}

export type IconButtonProps = DefaultProps & Omit<ComponentProps<'button'>, keyof DefaultProps>

/**
 * A circular icon-only control for floating affordances — carousel arrows,
 * overlay dismissals.
 *
 * Deliberately not theme-reactive: it stays a light pill in dark mode so it
 * reads against arbitrary imagery. Only the radius and focus ring are tokens.
 */
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
