import type { ReactElement } from 'react'
import { useRender } from '@base-ui/react/use-render'

import { cx } from '../../utils/cx'

export type BreadcrumbItem = {
  /** Visible label. Ignored when `render` supplies its own children. */
  label: string
  /** Destination for the default `<a>`. Ignored when `render` is set — the
   *  passed element owns its own destination (e.g. a router `to` prop). */
  href?: string
  /** Escape hatch for a router-aware link, e.g. `<Link to="/categories" />` —
   *  cloned with this crumb's link class and, on the last item, `aria-current`. */
  render?: ReactElement
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

const Crumb = ({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) => {
  const isLink = Boolean(item.href) || Boolean(item.render)

  return useRender({
    defaultTagName: isLink ? 'a' : 'span',
    render: item.render,
    props: {
      'data-part': isLink ? 'link' : 'text',
      className: isLink ? 'droppy-Breadcrumb-link' : 'droppy-Breadcrumb-text',
      href: item.render ? undefined : item.href,
      'aria-current': isLast ? 'page' : undefined,
      children: item.label,
    },
  })
}

/**
 * A trail of ancestor pages leading to the current one — categories,
 * restaurants, anything with a browsable hierarchy above it.
 *
 * Renders plain `<a>` crumbs by default. Pass `render` on an item to swap in
 * a router-aware link instead — the design system itself has no router
 * dependency.
 */
export const Breadcrumb = ({ items, className }: BreadcrumbProps) => (
  <nav data-part="root" aria-label="breadcrumb" className={cx('droppy-Breadcrumb', className)}>
    <ol data-part="list" className="droppy-Breadcrumb-list">
      {items.map((item, index) => (
        <li
          key={item.href ?? `${item.label}-${index}`}
          data-part="item"
          className="droppy-Breadcrumb-item"
        >
          <Crumb item={item} isLast={index === items.length - 1} />
          {index < items.length - 1 && (
            <span data-part="separator" className="droppy-Breadcrumb-separator" aria-hidden="true">
              /
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)
