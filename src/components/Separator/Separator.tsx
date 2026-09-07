import type { ComponentProps } from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type SeparatorProps = Omit<ComponentProps<typeof BaseSeparator>, 'render' | 'className'> & {
  className?: string
}

export const Separator = ({ orientation = 'horizontal', className, ...rest }: SeparatorProps) => (
  <BaseSeparator
    data-part="root"
    orientation={orientation}
    className={cx(theme.SeparatorRoot, 'droppy-Separator', className)}
    {...rest}
  />
)
