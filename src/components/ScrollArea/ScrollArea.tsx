import type { ReactNode } from 'react'
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type ScrollAreaProps = {
  children?: ReactNode
  orientation?: 'vertical' | 'horizontal' | 'both'
  className?: string
}

export const ScrollArea = ({ children, orientation = 'vertical', className }: ScrollAreaProps) => (
  <BaseScrollArea.Root
    data-part="root"
    className={cx(theme.ScrollAreaRoot, 'droppy-ScrollArea', className)}
  >
    <BaseScrollArea.Viewport data-part="viewport" className={theme.ScrollAreaViewport}>
      <BaseScrollArea.Content data-part="content" className={theme.ScrollAreaContent}>
        {children}
      </BaseScrollArea.Content>
    </BaseScrollArea.Viewport>
    {orientation !== 'horizontal' && (
      <BaseScrollArea.Scrollbar data-part="scrollbar" className={theme.ScrollAreaScrollbar}>
        <BaseScrollArea.Thumb data-part="thumb" className={theme.ScrollAreaThumb} />
      </BaseScrollArea.Scrollbar>
    )}
    {orientation !== 'vertical' && (
      <BaseScrollArea.Scrollbar
        data-part="scrollbar"
        className={theme.ScrollAreaScrollbar}
        orientation="horizontal"
      >
        <BaseScrollArea.Thumb data-part="thumb" className={theme.ScrollAreaThumb} />
      </BaseScrollArea.Scrollbar>
    )}
    {orientation === 'both' && (
      <BaseScrollArea.Corner data-part="corner" className={theme.ScrollAreaCorner} />
    )}
  </BaseScrollArea.Root>
)
