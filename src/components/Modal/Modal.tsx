import { useRef, type PropsWithChildren, type ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import theme from '../../theme'

import { Button } from '../Button'
import { cx } from '../../utils/cx'
import { useContainer } from '../../utils/useContainer'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  container?: HTMLElement | string | null
  'aria-label'?: string
  className?: string
  children?: ReactNode
}

export const Modal = ({
  children,
  isOpen,
  onClose,
  container,
  className,
  'aria-label': ariaLabel = 'dialog',
}: PropsWithChildren<ModalProps>) => {
  const resolvedContainer = useContainer(container)

  // Focus the popup itself rather than the close button: the dialog's content
  // is what the user asked for, and landing on "close" reads as an invitation
  // to leave. Tab still reaches the close button first.
  const popupRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal container={resolvedContainer}>
        <Dialog.Backdrop
          data-part="backdrop"
          className={cx(theme.DialogBackdrop, 'droppy-Modal-backdrop')}
          data-testid="modal-backdrop"
        />
        <Dialog.Popup
          data-part="root"
          ref={popupRef}
          initialFocus={popupRef}
          className={cx(theme.DialogPopup, 'droppy-Modal', className)}
          data-testid="modal"
          aria-label={ariaLabel}
        >
          <div data-part="topbar" className="droppy-Modal-topBar">
            <Button
              data-part="close"
              data-testid="modal-close-btn"
              onClick={onClose}
              clear
              round
              icon="cross"
              aria-label="close modal"
              iconSize={16}
            />
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
