import type { PropsWithChildren, ReactNode } from 'react'

import { cx } from '../../utils/cx'

export type PageTemplateProps = {
  /** Rendered above the content area, outside the `<main>` landmark. */
  header?: ReactNode
  /** Rendered below the content area, outside the `<main>` landmark. */
  footer?: ReactNode
  className?: string
}

/**
 * The page shell: header, a `<main>` content area, and footer — the top-level
 * layout every routed page sits inside.
 *
 * The content area carries a minimum height so a short page's footer still
 * lands at the bottom of the viewport instead of riding up under the fold.
 */
export const PageTemplate = ({
  header,
  footer,
  children,
  className,
}: PropsWithChildren<PageTemplateProps>) => (
  <div className={cx('droppy-PageTemplate', className)}>
    {header}
    <main className="droppy-PageTemplate-content">{children}</main>
    {footer}
  </div>
)
