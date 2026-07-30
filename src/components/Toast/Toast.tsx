import { Fragment, type ReactNode } from 'react'
import { Toast as BaseToast } from '@base-ui/react/toast'
import theme from '../../theme'

import { cx } from '../../utils/cx'
import { useContainer } from '../../utils/useContainer'

export type ToastProviderProps = {
  /** The page content that raises toasts via `useToast`. */
  children?: ReactNode
  /** Where to portal the toast stack. Accepts an element or a selector; defaults to the body. */
  container?: HTMLElement | string | null
  /** The default time (ms) before a toast auto-dismisses. `0` disables auto-dismiss. */
  timeout?: number
  /** The maximum number of toasts shown at once; older ones are marked limited rather than removed. */
  limit?: number
  className?: string
}

function ToastStack() {
  const { toasts } = BaseToast.useToastManager()

  return toasts.map((toast) => (
    <Fragment key={toast.id}>
      <BaseToast.Root toast={toast} className={theme.ToastRoot}>
        <BaseToast.Content className={theme.ToastContent}>
          <div className={theme.ToastText}>
            <BaseToast.Title className={theme.ToastTitle} />
            <BaseToast.Description className={theme.ToastDescription} />
          </div>
          <BaseToast.Close className={theme.ToastClose}>Dismiss</BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    </Fragment>
  ))
}

/**
 * A stack of transient, self-dismissing notifications, portaled to the corner
 * of the page.
 *
 * Toast has no trigger and no open prop of its own — a consuming app wraps
 * its tree once in this provider, then raises toasts imperatively through
 * `useToast().add(...)`. This component owns the only rendering of the toast
 * list; there is nothing else to compose by hand.
 */
export const ToastProvider = ({
  children,
  container,
  timeout,
  limit,
  className,
}: ToastProviderProps) => {
  const resolvedContainer = useContainer(container)

  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal container={resolvedContainer}>
        <BaseToast.Viewport className={cx(theme.ToastViewport, 'droppy-Toast', className)}>
          <ToastStack />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}

/**
 * Raises and manages toasts from anywhere beneath `ToastProvider`.
 *
 * A thin re-export of Base UI's toast manager hook: `add` queues a toast and
 * returns its id, and `promise` chains a loading toast through to success or
 * error so async work reports its own outcome.
 */
export const useToast = BaseToast.useToastManager
