import type { ReactElement, ReactNode } from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import theme from '@droppy/theme'

import { cx } from '../../utils/cx'

export type TooltipProps = {
  /** The tip's content. */
  label: ReactNode
  /** The element the tip describes. Rendered as the trigger itself, not wrapped. */
  children: ReactElement
  /** Gap between the trigger and the tip. */
  sideOffset?: number
  className?: string
}

/**
 * A hover and focus hint for a control whose purpose is not obvious from its
 * face — typically an icon-only button.
 *
 * A tooltip is a supplement, never the only place the information lives: give
 * the trigger its own accessible name as well.
 */
export const Tooltip = ({ label, children, sideOffset = 8, className }: TooltipProps) => (
  <BaseTooltip.Root>
    {/* `render` makes the child the trigger rather than wrapping it, so the
        layout stays flat and the trigger keeps its own styling. */}
    <BaseTooltip.Trigger render={children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={sideOffset}>
        <BaseTooltip.Popup className={cx(theme.TooltipPopup, 'droppy-Tooltip', className)}>
          {label}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
)

/**
 * Shares open/close timing across the tooltips beneath it, so moving between
 * neighbouring controls does not replay the opening delay each time. Optional.
 */
export const TooltipProvider = BaseTooltip.Provider
