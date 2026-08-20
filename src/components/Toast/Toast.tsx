import { Fragment, type ReactNode } from 'react'
import { Toast as BaseToast } from '@base-ui/react/toast'
import theme from '../../theme'

import { cx } from '../../utils/cx'
import { useContainer } from '../../utils/useContainer'

export type ToastProviderProps = {
  children?: ReactNode
  container?: HTMLElement | string | null
  timeout?: number
  limit?: number
  className?: string
}

function ToastStack() {
  const { toasts } = BaseToast.useToastManager()

  return toasts.map((toast) => (
    <Fragment key={toast.id}>
      <BaseToast.Root data-part="toast" toast={toast} className={theme.ToastRoot}>
        <BaseToast.Content data-part="content" className={theme.ToastContent}>
          <div className={theme.ToastText}>
            <BaseToast.Title data-part="title" className={theme.ToastTitle} />
            <BaseToast.Description data-part="description" className={theme.ToastDescription} />
          </div>
          <BaseToast.Close data-part="close" className={theme.ToastClose}>
            Dismiss
          </BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    </Fragment>
  ))
}

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
        <BaseToast.Viewport
          data-part="root"
          className={cx(theme.ToastViewport, 'droppy-Toast', className)}
        >
          <ToastStack />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  )
}

export const useToast = BaseToast.useToastManager
