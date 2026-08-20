import type { ReactElement, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type TooltipProps = {
  label: ReactNode
  children: ReactElement
  sideOffset?: number
  className?: string
}

export const Tooltip = ({ label, children, sideOffset = 8, className }: TooltipProps) => (
  <BaseTooltip.Root>
    {/* `render` makes the child the trigger rather than wrapping it, so the
        layout stays flat and the trigger keeps its own styling. */}
    <BaseTooltip.Trigger data-part="trigger" render={children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={sideOffset}>
        <BaseTooltip.Popup
          data-part="popup"
          className={cx(theme.TooltipPopup, 'droppy-Tooltip', className)}
        >
          {label}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
)

export const TooltipProvider = BaseTooltip.Provider
