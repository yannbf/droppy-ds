import type { PropsWithChildren, ReactNode } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import theme from '../../theme'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { cx } from '../../utils/cx'
import { useContainer } from '../../utils/useContainer'

export type SidebarProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  footer?: ReactNode
  container?: HTMLElement | string | null
  className?: string
  children?: ReactNode
}

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
          data-part="backdrop"
          className={cx(theme.DrawerBackdrop, 'droppy-Sidebar-backdrop')}
          data-testid="sidebar-backdrop"
        />
        <Drawer.Viewport className="droppy-Sidebar-viewport">
          <Drawer.Popup
            data-part="root"
            className={cx(theme.DrawerPopup, 'droppy-Sidebar', className)}
            data-testid="sidebar"
          >
            <div data-part="topbar" className="droppy-Sidebar-topBar">
              <Drawer.Title
                data-part="title"
                className={theme.DrawerTitle}
                render={<Heading level={4}>{title}</Heading>}
              />
              <Button
                data-part="close"
                aria-label="close sidebar"
                data-testid="sidebar-close-btn"
                onClick={onClose}
                clear
                round
                icon="cross"
                iconSize={16}
              />
            </div>
            <div
              data-part="content"
              className="droppy-Sidebar-content"
              data-testid="sidebar-content"
            >
              {children}
            </div>
            {footer && (
              <div
                data-part="footer"
                className="droppy-Sidebar-footer"
                data-testid="sidebar-footer"
              >
                {footer}
              </div>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
