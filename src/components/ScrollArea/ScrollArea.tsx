import type { ReactNode } from 'react'
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type ScrollAreaProps = {
  children?: ReactNode
  /** Which axes get a scrollbar. `'vertical'` and `'horizontal'` render one
   *  scrollbar; `'both'` renders one of each plus the corner where they meet. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  className?: string
}

/**
 * A scrollable panel with a themed, hover-revealed scrollbar in place of the
 * platform's own.
 *
 * Base UI's `ScrollArea` supplies the scroll mechanics — overflow detection,
 * thumb drag, hover/scroll visibility state — so this only adds the shape and
 * which axes get a scrollbar. Sizing is fixed by the theme layer, matching
 * every other Droppy overlay; use `className` for one-off layout changes.
 */
export const ScrollArea = ({ children, orientation = 'vertical', className }: ScrollAreaProps) => (
  <BaseScrollArea.Root className={cx(theme.ScrollAreaRoot, 'droppy-ScrollArea', className)}>
    <BaseScrollArea.Viewport className={theme.ScrollAreaViewport}>
      <BaseScrollArea.Content className={theme.ScrollAreaContent}>
        {children}
      </BaseScrollArea.Content>
    </BaseScrollArea.Viewport>
    {orientation !== 'horizontal' && (
      <BaseScrollArea.Scrollbar className={theme.ScrollAreaScrollbar}>
        <BaseScrollArea.Thumb className={theme.ScrollAreaThumb} />
      </BaseScrollArea.Scrollbar>
    )}
    {orientation !== 'vertical' && (
      <BaseScrollArea.Scrollbar className={theme.ScrollAreaScrollbar} orientation="horizontal">
        <BaseScrollArea.Thumb className={theme.ScrollAreaThumb} />
      </BaseScrollArea.Scrollbar>
    )}
    {orientation === 'both' && <BaseScrollArea.Corner className={theme.ScrollAreaCorner} />}
  </BaseScrollArea.Root>
)
