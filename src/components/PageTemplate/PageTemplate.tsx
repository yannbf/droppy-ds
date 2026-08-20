import type { PropsWithChildren, ReactNode } from 'react'

import { cx } from '../../utils/cx'

export type PageTemplateProps = {
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

export const PageTemplate = ({
  header,
  footer,
  children,
  className,
}: PropsWithChildren<PageTemplateProps>) => (
  <div data-part="root" className={cx('droppy-PageTemplate', className)}>
    {header}
    <main data-part="content" className="droppy-PageTemplate-content">
      {children}
    </main>
    {footer}
  </div>
)
