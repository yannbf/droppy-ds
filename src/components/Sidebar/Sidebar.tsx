import type { PropsWithChildren, ReactNode } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import theme from '@droppy/theme'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { cx } from '../../utils/cx'
import { useContainer } from '../../utils/useContainer'

export type SidebarProps = {
  isOpen: boolean
  /** Heading shown in the top bar. Also names the dialog. */
  title: string
  onClose: () => void
  /** Pinned to the bottom of the panel — for totals and primary actions. */
  footer?: ReactNode
  /** Where to portal. Accepts an element or a selector; defaults to the body. */
  container?: HTMLElement | string | null
  className?: string
  children?: ReactNode
}

/**
 * A panel that slides in from the trailing edge — for carts, filters, and
 * anything reviewed alongside the page rather than instead of it.
 *
 * Base UI's `Drawer` supplies Escape-to-close, swipe-to-dismiss, the focus
 * trap and the scroll lock.
 */
export const Sidebar = ({
  children,
  footer,
  isOpen,
  title,
  onClose,
  container,
  className,
}: PropsWithChildren<SidebarProps>) => {
  const resolvedContainer = useContainer(container)

  return (
    <Drawer.Root
      open={isOpen}
      swipeDirection="right"
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Drawer.Portal container={resolvedContainer}>
        <Drawer.Backdrop
          className={cx(theme.DrawerBackdrop, 'droppy-Sidebar-backdrop')}
          data-testid="sidebar-backdrop"
        />
        <Drawer.Viewport className="droppy-Sidebar-viewport">
          <Drawer.Popup
            className={cx(theme.DrawerPopup, 'droppy-Sidebar', className)}
            data-testid="sidebar"
          >
            <div className="droppy-Sidebar-topBar">
              <Drawer.Title
                className={theme.DrawerTitle}
                render={<Heading level={4}>{title}</Heading>}
              />
              <Button
                aria-label="close sidebar"
                data-testid="sidebar-close-btn"
                onClick={onClose}
                clear
                round
                icon="cross"
                iconSize={16}
              />
            </div>
            <div className="droppy-Sidebar-content" data-testid="sidebar-content">
              {children}
            </div>
            {footer && (
              <div className="droppy-Sidebar-footer" data-testid="sidebar-footer">
                {footer}
              </div>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
